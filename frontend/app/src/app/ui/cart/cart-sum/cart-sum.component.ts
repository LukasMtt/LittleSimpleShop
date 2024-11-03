import { Component, Input } from '@angular/core';
import { Cart } from '../../../models/cart.model';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-sum',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-sum.component.html',
  styleUrl: './cart-sum.component.css'
})
export class CartSumComponent {
  @Input({required: true}) cart!: Cart | undefined;
  cartSubscription$: Subscription;

  constructor(public cartService: CartService) {
    this.cartSubscription$ = cartService.getCartObservable().subscribe((x) => this.cart = x);
  }

  ngOnDestroy(): void {
    this.cartSubscription$.unsubscribe();
  }

  getCartPriceSum() {
    var baseItems = this.cart?.items.filter((x) => x.count > 0);
    if (baseItems && baseItems.length > 0) {
      return baseItems.map((x) => x.product.price * x.count).reduce((x, y) => x += y);
    }
    return 0;
  }
}
