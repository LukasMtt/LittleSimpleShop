import { Component, computed, effect, input, signal } from '@angular/core';
import { TickCounterComponent } from '../../shared/tick-counter/tick-counter.component';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '../../shared/base.component';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FileFetchService } from '../../../services/file.fetch.service';
import { DisplayImageInput } from '../../../models/component/display-image.input';

@Component({
  selector: 'app-cart-show-item',
  imports: [TickCounterComponent, CurrencyPipe, MatIcon, RouterLink],
  templateUrl: './cart-show-item.component.html',
  styleUrl: './cart-show-item.component.css'
})
export class CartShowItemComponent extends BaseComponent {
  cartItemProductId = input.required<number>();

  cart = computed(() => {
    return this.cartService.cartReadonly();
  });
  cartItem = computed(() => {
    const item = this.cart().items.find((x) => {
      return x.product.id == this.cartItemProductId();
    });
    if (item) {
      return {
        ...item
      };
    }
    return undefined;
  });
  productLink = computed(() => {
    return `/showProduct/${this.cartItem()?.product.id ?? 0}`;
  });
  totalPrice = computed(() => {
    const price = this.cartItem()?.product?.price;
    const count = this.cartItem()?.amount;
    if (count && price) {
      return (count * price).toString();
    }
    return '';
  });
  cartItemPerPieceText = signal<string>('');
  cartItemForAllPiecesText = signal<string>('');

  cartItemImage: DisplayImageInput | undefined;

  constructor(
    public cartService: CartService,
    private fileFetchService: FileFetchService
  ) {
    super();
    this.cartItemPerPieceText.set(this.res('CARTITEM_PER_PIECE'));
    this.cartItemForAllPiecesText.set(this.res('CARTITEM_ALL_PIECES'));
    effect(() => {
      this.cartItemImage = this.cartItem()?.product.image;
      this.setCartItemImage();
    });
  }

  public updateCartItemCount(count: number) {
    if (this.cartItem()?.product) {
      this.cartService.updateCartItemCount(this.cartItem()!.product.id, count);
    }
  }

  public deleteCartItem() {
    if (this.cartItem()?.product) {
      this.cartService.popCartItemByProductId(this.cartItem()!.product.id);
    }
  }

  public setCartItemImage() {
    if (!this.cartItemImage) {
      return;
    }
    let httpResponse = this.fileFetchService.getPublicImageResponseBlob(
      this.cartItemImage.id,
      this.cartItemImage.fileId || ''
    );
    httpResponse.subscribe((response) => {
      this.fileFetchService.readFileAsDataUrl(
        response.body as Blob,
        response.headers.get('Content-Type') ?? '',
        this.cartItemImage!.fileContent!
      );
    });
  }
}
