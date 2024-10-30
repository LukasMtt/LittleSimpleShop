import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart.item.model';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local.storage.service';
import { JsonService } from './json.service';
import { ProductService } from './product.service';
import { CartStorage } from '../models/cart.storage.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart; 
  private cartObservable$: BehaviorSubject<Cart>;

  constructor(private localStorageService: LocalStorageService, private jsonService: JsonService, private productService: ProductService) {
    this.cart = { items: [] };
    this.cartObservable$ = new BehaviorSubject(this.cart);
    if(this.getCartStorageString()) {
      this.getCartFromStorageString();
    }
  }

  public getCartObservable() {
    return this.cartObservable$;
  }

  public pushCartItem(item: CartItem) {
    var existingItem = this.cart.items.find((x) => x.product && item.product &&  x.product.id === item.product.id);
    if (existingItem) {
      existingItem.count = existingItem.count + 1;
    }
    else {
      this.cart.items.push(item);
    }
    this.setCartStorageString();
    this.cartObservable$.next(this.cart);
  }

  public popCartItemByProductId(productId: number) {
    this.cart.items.find((x) => x.product && x.product.id == productId);
    this.setCartStorageString();
    this.cartObservable$.next(this.cart);
  }

  public updateCartItemCount(productId: number, count: number) {
    var item = this.cart?.items.find((x) => x.product.id == productId);
    if (item) {
      item.count = count;
      this.setCartStorageString();
      this.cartObservable$.next(this.cart);
    }
  }

  public resetCart() {
    this.cart.items = [];
    this.setCartStorageString();
    this.cartObservable$.next(this.cart);
  }

  private setCartStorageString() {
    this.localStorageService.setStorageItem("cart", this.createCartStorageString());
  }

  private createCartStorageString() {
    var cartStorageObject: CartStorage = new CartStorage();
    this.cart.items.forEach(cartItem => {
      cartStorageObject.items.push({ productId: cartItem.product?.id ?? 0, count: cartItem.count });
    });
    return JSON.stringify(this.jsonService.getSerializer().serialize(cartStorageObject));
  }

  private getCartStorageString() {
    if (this.localStorageService.getStorageItem('cart'))
      return this.jsonService.getSerializer().deserializeObject(this.localStorageService.getStorageItem('cart')!, CartStorage);
    return null;
  }

  private getCartFromStorageString() {
    var cartStorageType = this.getCartStorageString();
    var cartItems: CartItem[] = [];

    if (cartStorageType) {
      this.productService.getProductsByIds(cartStorageType.items.map((x) => x.productId).filter((x) => x)).subscribe((products) => {
        products.forEach(product => {
          var count = cartStorageType?.items.find((x) => x.productId == product.id)?.count;
          if (product && count) {
            cartItems.push({ product: product, count: count});
          }
        });
        var cart: Cart = { items: [] };
        cart.items = cartItems;

        this.cart = cart;
        this.cartObservable$.next(this.cart);
      });
    }
  }
}