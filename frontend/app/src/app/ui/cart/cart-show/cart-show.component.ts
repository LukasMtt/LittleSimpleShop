import { Component } from '@angular/core';
import { Cart } from '../../../models/cart.model';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartSumComponent } from '../cart-sum/cart-sum.component';
import { BaseComponent } from '../../shared/base.component';

@Component({
  selector: 'app-cart-show',
  standalone: true,
  imports: [CartItemComponent, CartSumComponent],
  templateUrl: './cart-show.component.html',
  styleUrl: './cart-show.component.css'
})
export class CartShowComponent extends BaseComponent {
  cart: Cart | undefined;
  cartSubscription$: Subscription;

  constructor(public cartService: CartService) {
    super();
    this.cartSubscription$ = cartService
      .getCartObservable()
      .subscribe((x) => (this.cart = x));
  }

  ngOnDestroy(): void {
    this.cartSubscription$.unsubscribe();
  }

  getCartItemsForDisplay() {
    return this.cart?.items.filter((x) => x.count > 0);
  }
}
