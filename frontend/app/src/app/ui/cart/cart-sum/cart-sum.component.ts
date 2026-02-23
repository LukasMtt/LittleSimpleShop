import { Component, Input } from '@angular/core';
import { CartInput } from '../../../models/component/cart.input';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '../../shared/base.component';

@Component({
  selector: 'app-cart-sum',
  imports: [CurrencyPipe],
  templateUrl: './cart-sum.component.html',
  styleUrl: './cart-sum.component.css'
})
export class CartSumComponent extends BaseComponent {
  @Input({ required: true }) cart!: CartInput | undefined;
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

  getCartPriceSum() {
    const invalidBaseItems = this.cart?.items.filter(
      (x) => x.product.price === undefined
    );
    if (invalidBaseItems && invalidBaseItems.length > 0) {
      return 'invalid sum';
    }
    const baseItems = this.cart?.items.filter((x) => x.count > 0);
    if (baseItems && baseItems.length > 0) {
      return baseItems
        .map((x) => x.product.price! * x.count)
        .reduce((x, y) => (x += y));
    }
    return 0;
  }
}
