import { Component, computed, effect, input, signal } from '@angular/core';
import { TickCounterComponent } from '../../shared/tick-counter/tick-counter.component';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '../../shared/base.component';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MetadataService } from '../../../services/metadata.service';
import {
  EndpointItem,
  EndpointResolveService
} from '../../../services/endpoint.resolve.service';

@Component({
  selector: 'app-cart-sidebar-item',
  imports: [TickCounterComponent, CurrencyPipe, MatIcon, RouterLink],
  templateUrl: './cart-sidebar-item.component.html',
  styleUrl: './cart-sidebar-item.component.css'
})
export class CartSidebarItemComponent extends BaseComponent {
  cartItemProductId = input.required<number>();

  cart = computed(() => {
    return this.cartService.cartReadonly();
  });
  cartItem = computed(() => {
    const item = this.cart().cartItems.find((x) => {
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
  currency = signal<string>('USD');
  imgSrc = signal<string>('');

  constructor(
    public cartService: CartService,
    metaDataService: MetadataService,
    endpointResolveService: EndpointResolveService
  ) {
    super();
    effect(() => {
      this.imgSrc.set(
        endpointResolveService.buildUrl(EndpointItem.GetPublicImage, [
          {
            key: 'imageId',
            value: `${this.cartItem()?.product?.image?.id ?? 0}`
          },
          {
            key: 'fileId',
            value: `${this.cartItem()?.product?.image?.fileId ?? ''}`
          }
        ])
      );
    });
    metaDataService.getMetadata().subscribe((metadata) => {
      this.currency.set(metadata.currency ?? 'USD');
    });
  }

  public updateCartItemCount(count: number) {
    if (this.cartItem()?.product) {
      this.cartService.updateCartItemAmount(this.cartItem()!.product.id, count);
    }
  }

  public deleteCartItem() {
    if (this.cartItem()?.product) {
      this.cartService.popCartItemByProductId(this.cartItem()!.product.id);
    }
  }
}
