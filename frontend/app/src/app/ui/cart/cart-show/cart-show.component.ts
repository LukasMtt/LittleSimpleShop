import { Component, computed } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CartSidebarItemComponent } from '../cart-sidebar-item/cart-sidebar-item.component';
import { CartSumComponent } from '../cart-sum/cart-sum.component';
import { BaseComponent } from '../../shared/base.component';

@Component({
  selector: 'app-cart-show',
  imports: [CartSidebarItemComponent, CartSumComponent],
  templateUrl: './cart-show.component.html',
  styleUrl: './cart-show.component.css'
})
export class CartShowComponent extends BaseComponent {
  cart = computed(() => {
    return this.cartService.cartReadonly();
  });

  constructor(public cartService: CartService) {
    super();
  }

  getCartItemProductIdsForDisplay() {
    return this.cart()
      ?.items?.filter((x) => x.count > 0 && x.product)
      .map((x) => x.product.id);
  }
}
