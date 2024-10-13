import { Component, Input } from '@angular/core';
import { CartItem } from '../models/cart.item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  	@Input({required: true}) cartItem!: CartItem;

    createImage() {
      if (this.cartItem?.product) {
        return 'data:image/webp;base64,' + this.cartItem.product.images[0].bytes;
      }
      return '';
    }
}
