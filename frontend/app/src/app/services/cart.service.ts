import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart.item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart; 

  constructor() {
    this.cart = {
      items: []
    };
  }

  getAllCartItems() {
    return this.cart.items;
  }

  pushCartItem(item: CartItem) {
    this.cart.items.push(item);
  }

  popCartItemByProductId(productId: number) {
    return this.cart.items.find((x) => x.product.id == productId);
  }

  resetCart() {
    this.cart.items = [];
  }
}
