import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { CartService } from '../../../services/cart.service';
import { CartInput } from '../../../models/component/cart.input';
import { Subscription } from 'rxjs';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CartItemComponent, RouterModule, ButtonComponent, ButtonComponent],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent
  extends BaseComponent
  implements OnChanges, OnDestroy
{
  @Input({ required: true }) isHidden!: boolean;

  cart: CartInput | undefined;
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

  public ngOnDestroy(): void {
    this.cartSubscription$.unsubscribe();
  }

  public ngOnChanges(): void {
    this.setSidebarPositionOnChange();
  }

  public getCartItemsForDisplay() {
    var result = this.cart?.items.filter((x) => x.count > 0);
    if (!result?.length || result.length < 3) {
      return result ?? [];
    }
    return result.slice(0, 3);
  }

  public onClickCartRoute() {
    this.isHidden = true;
    this.setSidebarPositionOnChange();
  }

  private setSidebarPositionOnChange() {
    if (this.isHidden) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '-50%');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '0%');
    }
  }
}
