import { Injectable } from '@angular/core';
import { CartInput } from '../models/component/cart.input';
import { CartItemInput } from '../models/component/cart-item.input';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local.storage.service';
import { JsonService } from './json.service';
import { ProductService } from './product.service';
import { CartStorageModel } from '../models/misc/cart-storage-model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //todo introduce model/class for servvice side or simply rename to ...model again
  private cart: CartInput;
  private cartObservable$: BehaviorSubject<CartInput>;

  constructor(
    private localStorageService: LocalStorageService,
    private jsonService: JsonService,
    private productService: ProductService
  ) {
    this.cart = { items: [] };
    this.cartObservable$ = new BehaviorSubject(this.cart);
    if (this.getCartStorageString()) {
      this.getCartFromStorageString();
    }
  }

  public getCartObservable() {
    return this.cartObservable$;
  }

  public pushCartItem(item: CartItemInput) {
    var existingItem = this.cart.items.find(
      (x) => x.product && item.product && x.product.id === item.product.id
    );
    if (existingItem) {
      existingItem.count = existingItem.count + 1;
    } else {
      this.cart.items.push(item);
    }
    this.setCartStorageString();
    this.cartObservable$.next(this.cart);
  }

  //odd handling to pop item (seemingly side effect behavior etc.)
  //timeout to wait for ui to find item to ensure side bar is not collapsed
  public popCartItemByProductId(productId: number) {
    setTimeout(() => {
      var item = this.cart.items.find(
        (x) => x.product && x.product.id == productId
      );
      this.cart.items = this.cart.items.filter((x) => x != item);
      this.setCartStorageString();
      this.cartObservable$.next(this.cart);
    }, 10);
  }

  //odd handling to pop item (seemingly side effect behavior etc.)
  //timeout to wait for ui to find item to ensure side bar is not collapsed
  public updateCartItemCount(productId: number, count: number) {
    setTimeout(() => {
      var item = this.cart?.items.find((x) => x.product.id == productId);
      if (item) {
        item.count = count;
        if (count < 1) {
          this.cart.items = this.cart.items.filter((x) => x != item);
        }
        this.setCartStorageString();
        this.cartObservable$.next(this.cart);
      }
    }, 10);
  }

  public resetCart() {
    this.cart.items = [];
    this.setCartStorageString();
    this.cartObservable$.next(this.cart);
  }

  private setCartStorageString() {
    this.localStorageService.setStorageItem(
      'cart',
      this.createCartStorageString()
    );
  }

  private createCartStorageString() {
    var cartStorageObject: CartStorageModel = new CartStorageModel();
    this.cart.items
      .filter((x) => x && x.count > 0)
      .forEach((cartItem) => {
        cartStorageObject.items.push({
          productId: cartItem.product?.id ?? 0,
          count: cartItem.count
        });
      });
    return JSON.stringify(
      this.jsonService.getSerializer().serialize(cartStorageObject)
    );
  }

  private getCartStorageString() {
    if (this.localStorageService.getStorageItem('cart'))
      return this.jsonService
        .getSerializer()
        .deserializeObject(
          this.localStorageService.getStorageItem('cart')!,
          CartStorageModel
        );
    return null;
  }

  private getCartFromStorageString() {
    var cartStorageType = this.getCartStorageString();
    var cartItems: CartItemInput[] = [];

    if (cartStorageType) {
      this.productService
        .getProductsByIds(
          cartStorageType.items.map((x) => x.productId).filter((x) => x)
        )
        .subscribe((products) => {
          products.forEach((product) => {
            var count = cartStorageType?.items.find(
              (x) => x.productId == product.id
            )?.count;
            if (product && count) {
              cartItems.push({ product: product, count: count });
            }
          });
          var cart: CartInput = { items: [] };
          cart.items = cartItems;

          this.cart = cart;
          this.cartObservable$.next(this.cart);
        });
    }
  }
}
