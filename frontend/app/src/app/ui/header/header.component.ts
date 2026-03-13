import {
  Component,
  computed,
  ElementRef,
  HostListener,
  model,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BaseComponent } from '../shared/base.component';
import { CartSidebarComponent } from '../cart/cart-sidebar/cart-sidebar.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderSidebarComponent } from './header-sidebar/header-sidebar.component';
import { NewsHeaderComponent } from './news-header/news-header.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
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
export class HeaderComponent extends BaseComponent {
  hideMainMenu = model<boolean>(true);
  hideCartMenu = model<boolean>(true);

  openCookieWindow = signal<boolean>(false);
  cookieText = signal<SafeHtml>('');
  cart = computed(() => {
    return this.cartService.cartReadonly();
  });

  constructor(
    private elementRef: ElementRef,
    private cartService: CartService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.cookieText.set(
      this.sanitizer.bypassSecurityTrustHtml(this.res('COOKIE_TEXT'))
    );
  }

  @HostListener('document:click', ['$event.target'])
  public onArbitraryClick(targetElement: any) {
    const isClickInsideHeaderElement =
      this.elementRef.nativeElement.contains(targetElement);
    if (!isClickInsideHeaderElement) {
      this.hideMainMenu.set(true);
      this.hideCartMenu.set(true);
    }
  }

  public onMenuButtonClick(): void {
    this.hideMainMenu.update((value) => !value);
  }

  public onCartButtonClick(): void {
    this.hideCartMenu.update((value) => !value);
  }

  public openPopUpCookie() {
    this.openCookieWindow.set(true);
  }

  public closePopUpCookie() {
    this.openCookieWindow.set(false);
  }
}
