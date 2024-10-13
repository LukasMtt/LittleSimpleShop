import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart.item.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart; 
  private observableCart$: BehaviorSubject<Cart>;

  constructor() {
    this.cart = {
      items: []
    };
    this.observableCart$ = new BehaviorSubject(this.cart);
  }

  getCartObservable() {
    return this.observableCart$;
  }

  pushCartItem(item: CartItem) {
    var existingItem = this.cart.items.find((x) => x.product.id === item.product.id);
    if (existingItem) {
      existingItem.count = existingItem.count + 1;
    }
    else {
      this.cart.items.push(item);
    }
    this.observableCart$.next(this.cart);
  }

  popCartItemByProductId(productId: number) {
    this.cart.items.find((x) => x.product.id == productId);
    this.observableCart$.next(this.cart);
  }

  resetCart() {
    this.cart.items = [];
    this.observableCart$.next(this.cart);
  }
}
