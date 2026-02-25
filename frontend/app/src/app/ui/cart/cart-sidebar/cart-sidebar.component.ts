import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  model,
  OnInit,
  Renderer2,
  signal
} from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { CartService } from '../../../services/cart.service';
import { CartSidebarItemComponent } from '../cart-sidebar-item/cart-sidebar-item.component';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { ReplaceStringPipe } from '../../../pipes/replace.pipe';

@Component({
  selector: 'app-cart-sidebar',
  imports: [
    CartSidebarItemComponent,
    RouterModule,
    ButtonComponent,
    ButtonComponent,
    ReplaceStringPipe
  ],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent extends BaseComponent implements OnInit {
  isHidden = model.required<boolean>();

  cart = computed(() => {
    return this.cartService.cartReadonly();
  });
  cartItemsToDisplay = computed(() => {
    const result = this.cart()
      ?.items?.filter((x) => x.count > 0 && x.product)
      .map((x) => x.product.id);
    if (result) {
      return result.slice(0, this.maxCountCartPreview());
    }
    return [];
  });
  cartItemFullCountHintText = signal<string>('');
  maxCountCartPreview = signal<number>(0);

  private readonly cartItemsInPreviewCountWidthPixelThreshold = 700;
  private readonly cartItemsInPreviewCountSmall = 4;
  private readonly cartItemsInPreviewCountLarge = 6;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public cartService: CartService
  ) {
    super();
    this.cartItemFullCountHintText.set(this.res('CARTITEM_FULL_COUNT_HINT'));
    effect(() => {
      if (this.isHidden() !== undefined) {
        this.setSidebarPositionOnChange();
      }
    });
  }

  public ngOnInit(): void {
    this.maxCountCartPreview.set(
      window.innerWidth > this.cartItemsInPreviewCountWidthPixelThreshold
        ? this.cartItemsInPreviewCountSmall
        : this.cartItemsInPreviewCountLarge
    );
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.maxCountCartPreview.set(
      window.innerWidth > this.cartItemsInPreviewCountWidthPixelThreshold
        ? this.cartItemsInPreviewCountSmall
        : this.cartItemsInPreviewCountLarge
    );
  }

  public onClickCartRoute() {
    this.isHidden.set(true);
  }

  private setSidebarPositionOnChange() {
    if (this.isHidden()) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '-100%');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '0%');
    }
  }
}
