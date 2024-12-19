import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BaseComponent } from '../shared/base.component';
import { CartSidebarComponent } from '../cart/cart-sidebar/cart-sidebar.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { Subscription } from 'rxjs';
import { HeaderSidebarComponent } from './header-sidebar/header-sidebar.component';
import { NewsHeaderComponent } from './news-header/news-header.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HeaderSidebarComponent,
    CartSidebarComponent,
    RouterLink,
    NewsHeaderComponent
  ]
})
export class HeaderComponent extends BaseComponent implements OnDestroy {
  cart: Cart | undefined;
  cartSubscription$: Subscription;
  showSideMenu: boolean = false;
  showCartMenu: boolean = false;

  constructor(private elementRef: ElementRef, public cartService: CartService) {
    super();
    this.cartSubscription$ = cartService
      .getCartObservable()
      .subscribe((x) => (this.cart = x));
  }

  @HostListener('document:click', ['$event.target'])
  public onArbitraryClick(targetElement: any) {
    const isClickInsideHeaderElement =
      this.elementRef.nativeElement.contains(targetElement);
    if (!isClickInsideHeaderElement) {
      this.showSideMenu = false;
      this.showCartMenu = false;
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription$.unsubscribe();
  }

  public onMenuButtonClick(): void {
    this.showSideMenu = !this.showSideMenu;
  }

  public onCartButtonClick(): void {
    this.showCartMenu = !this.showCartMenu;
  }

  public getCartSize(): number {
    return this.cart?.items?.length ?? 0;
  }
}
