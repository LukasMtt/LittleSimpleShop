import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { BaseComponent } from '../../shared/base.component';
import { SidebarItemComponent } from '../../shared/sidebar-item/sidebar-item.component';
import { CartService } from '../../../services/cart.service';
import { Cart } from '../../../models/cart.model';
import { Subscription } from 'rxjs';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarItemComponent,
    CartItemComponent,
    RouterModule
  ],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent
  extends BaseComponent
  implements OnChanges, OnDestroy
{
  @Input({ required: true }) isHidden!: boolean;

  cart: Cart | undefined;
  cartSubscription$: Subscription;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public cartService: CartService
  ) {
    super();
    this.cartSubscription$ = cartService
      .getCartObservable()
      .subscribe((x) => (this.cart = x));
  }

  ngOnDestroy(): void {
    this.cartSubscription$.unsubscribe();
  }

  ngOnChanges(): void {
    this.setSidebarPositionOnChange();
  }

  getCartItemsForDisplay() {
    var result = this.cart?.items.filter((x) => x.count > 0);
    if (!result?.length || result.length < 4) {
      return result ?? [];
    }
    return result.slice(0, 4);
  }

  private setSidebarPositionOnChange() {
    if (this.isHidden) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '-50%');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '0%');
    }
  }
}
