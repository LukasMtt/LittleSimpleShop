import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart.item.model';
import { TickCounterComponent } from "../shared/tick-counter/tick-counter.component";
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { CardViewable } from '../../models/card.viewable.model';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [TickCounterComponent, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  	@Input({required: true}) cartItem!: CartItem;

    cartSubscription$: Subscription;
    cart: Cart | undefined;

    constructor(public cartService: CartService) {
      this.cartSubscription$ = cartService.getCartObservable().subscribe((x) => this.cart = x);
    }

    getPrice(cardViewable: CardViewable | undefined) {
      var product = cardViewable as Product;
      if (product) {
          return product.price;
      }
      return '';
    }
    
    updateCartItemCount(count: number) {
      this.cartService.updateCartItemCount(this.cartItem.product.id, count);
    }

    createImage() {
      if (this.cartItem?.product) {
        return 'data:image/webp;base64,' + this.cartItem.product.images[0].bytes;
      }
      return '';
    }
}
