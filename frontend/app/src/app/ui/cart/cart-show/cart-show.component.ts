import { Component } from '@angular/core';
import { Cart } from '../../../models/cart.model';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { SidebarItemComponent } from "../../shared/sidebar-item/sidebar-item.component";
import { CartItemComponent } from "../cart-item/cart-item.component";
import { CartSumComponent } from "../cart-sum/cart-sum.component";
import { CartCheckoutFormComponent } from "../cart-checkout-form/cart-checkout-form.component";

@Component({
  selector: 'app-cart-show',
  standalone: true,
  imports: [SidebarItemComponent, CartItemComponent, CartSumComponent, CartCheckoutFormComponent],
  templateUrl: './cart-show.component.html',
  styleUrl: './cart-show.component.css'
})
export class CartShowComponent {
  cart: Cart | undefined;
  cartSubscription$: Subscription;

  constructor(public cartService: CartService) {
    this.cartSubscription$ = cartService.getCartObservable().subscribe((x) => this.cart = x);
  }

  ngOnDestroy(): void {
    this.cartSubscription$.unsubscribe();
  }

  getCartItemsForDisplay() {
    return this.cart?.items.filter((x) => x.count > 0);
  }
}
