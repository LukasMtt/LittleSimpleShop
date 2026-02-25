import { Injectable, signal } from '@angular/core';
import { CartModel } from '../models/component/cart.model';
import { CartItemModel } from '../models/component/cart-item.model';
import { LocalStorageService } from './local.storage.service';
import { JsonService } from './json.service';
import { ProductService } from './product.service';
import { CartStorageModel } from '../models/misc/cart-storage-model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = signal<CartModel>({ items: [] });

  //überall wo das benutzt wird, wird auch der fileContent gesetzt?
  cartReadonly = this.cart.asReadonly();

  constructor(
    private localStorageService: LocalStorageService,
    private jsonService: JsonService,
    private productService: ProductService
  ) {
    this.setCartModelFromStorageString();
  }

  public pushCartItem(item: CartItemModel) {
    const cartItems = this.cart().items;
    const existingItem = cartItems.find(
      (x) => x.product && item.product && x.product.id === item.product.id
    );
    if (existingItem) {
      existingItem.count = existingItem.count + item.count;
    } else {
      cartItems.push(item);
    }
    this.cart.set({ items: cartItems });
    this.setCartStorageString();
  }

  public popCartItemByProductId(productId: number) {
    let cartItems = this.cart().items;
    const item = cartItems.find((x) => x.product && x.product.id == productId);
    cartItems = cartItems.filter((x) => x != item);
    this.cart.set({ items: cartItems });
    this.setCartStorageString();
  }

  public updateCartItemCount(productId: number, count: number) {
    let cartItems = this.cart().items;
    const item = cartItems.find((x) => x.product && x.product.id == productId);
    if (item) {
      item.count = count;
      if (count < 1) {
        cartItems = cartItems.filter((x) => x != item);
      }
      this.cart.set({ items: cartItems });
      this.setCartStorageString();
    }
  }

  public resetCart() {
    this.cart.set({ items: [] });
    this.setCartStorageString();
  }

  private setCartStorageString() {
    this.localStorageService.setStorageItem(
      'cart',
      this.createCartStorageString()
    );
  }

  private createCartStorageString() {
    const cartStorageObject: CartStorageModel = new CartStorageModel();
    this.cart()
      .items.filter((x) => x && x.count > 0)
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

  private setCartModelFromStorageString() {
    const cartStorageModel = this.getCartStorageModel();
    const cartItems: CartItemModel[] = [];

    if (cartStorageModel) {
      this.productService
        .getProductsByIds(
          cartStorageModel.items.map((x) => x.productId).filter((x) => x)
        )
        .subscribe((products) => {
          products.forEach((product) => {
            const amount = cartStorageModel?.items.find(
              (x) => x.productId == product.id
            )?.count;
            if (product && amount) {
              const mainProductImage = product.images[0];
              cartItems.push({
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: {
                    id: mainProductImage.id,
                    fileId: mainProductImage.fileId,
                    productId: mainProductImage.productId,
                    fileContent: { dataUrl: '' }
                  }
                },
                count: amount
              });
            }
          });
          this.cart.set({ items: cartItems });
        });
    }
  }

  private getCartStorageModel() {
    if (this.localStorageService.getStorageItem('cart'))
      return this.jsonService
        .getSerializer()
        .deserializeObject(
          this.localStorageService.getStorageItem('cart')!,
          CartStorageModel
        );
    return null;
  }
}
