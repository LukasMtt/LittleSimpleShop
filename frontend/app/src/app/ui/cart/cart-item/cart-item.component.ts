import { Component, Input } from '@angular/core';
import { CartItem } from '../../../models/cart.item.model';
import { TickCounterComponent } from '../../shared/tick-counter/tick-counter.component';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from '../../../models/cart.model';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '../../shared/base.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [TickCounterComponent, CurrencyPipe, MatIcon],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent extends BaseComponent {
  @Input({ required: true }) cartItem!: CartItem;
  @Input() previewPictureSize: 'medium' | 'large' = 'large';

  cartSubscription$: Subscription;
  cart: Cart | undefined;

  constructor(public cartService: CartService) {
    super();
    this.cartSubscription$ = cartService
      .getCartObservable()
      .subscribe((x) => (this.cart = x));
  }

  public getPrice() {
    var product = this.cartItem.product;
    if (product) {
      return product.price;
    }
    return '';
  }

  public getTotalPrice() {
    var price = this.cartItem.product?.price;
    var count = this.cartItem.count;
    if (count && price) {
      return count * price;
    }
    return '';
  }

  public updateCartItemCount(count: number) {
    this.cartService.updateCartItemCount(this.cartItem.product.id, count);
  }

  public deleteCartItem() {
    this.cartService.popCartItemByProductId(this.cartItem.product.id);
  }

  public createImage() {
    if (this.cartItem?.product) {
      return 'data:image/webp;base64,' + this.cartItem.product.images[0].bytes;
    }
    return '';
  }
}
