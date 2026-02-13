import { Component, Input, OnInit } from '@angular/core';
import { CartItemInput } from '../../../models/component/cart-item.input';
import { TickCounterComponent } from '../../shared/tick-counter/tick-counter.component';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';
import { CartInput } from '../../../models/component/cart.input';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '../../shared/base.component';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FileFetchService } from '../../../services/file.fetch.service';
import { DisplayImageInput } from '../../../models/component/display-image.input';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [TickCounterComponent, CurrencyPipe, MatIcon, RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent extends BaseComponent implements OnInit {
  @Input({ required: true }) get cartItem(): CartItemInput | undefined {
    return this._cartItem;
  }
  set cartItem(newValue: CartItemInput | undefined) {
    this._cartItem = newValue;
    this.setCartItemImage();
  }
  @Input() previewPictureSize: 'medium' | 'large' = 'large';

  cartSubscription$: Subscription;
  cart: CartInput | undefined;
  cartItemImage: DisplayImageInput | undefined;
  productLink: string = '';
  totalPrice: string = '';

  private _cartItem: CartItemInput | undefined;

  constructor(
    public cartService: CartService,
    private fileFetchService: FileFetchService
  ) {
    super();
    this.cartSubscription$ = cartService
      .getCartObservable()
      .subscribe((x) => (this.cart = x));
  }

  public ngOnInit(): void {
    if (this.cartItem?.product) {
      this.productLink = `/showProduct/${this.cartItem.product.id}`;
    }
    this.totalPrice = this.getTotalPrice();
  }

  public getPrice() {
    if (this.cartItem?.product) {
      return this.cartItem.product.price;
    }
    return '';
  }

  public getTotalPrice() {
    var price = this.cartItem?.product?.price;
    var count = this.cartItem?.count;
    if (count && price) {
      return (count * price).toString();
    }
    return '';
  }

  public updateCartItemCount(count: number) {
    if (this.cartItem?.product) {
      this.cartService.updateCartItemCount(this.cartItem.product.id, count);
    }
  }

  public deleteCartItem() {
    if (this.cartItem?.product) {
      this.cartService.popCartItemByProductId(this.cartItem.product.id);
    }
  }

  public setCartItemImage() {
    if (
      !this.cartItem?.product?.images ||
      this.cartItem?.product?.images?.length === 0
    ) {
      return;
    }
    this.cartItemImage = {
      id: this.cartItem.product.images[0].id,
      fileId: this.cartItem.product.images[0].fileId,
      productId: this.cartItem.product.images[0].productId,
      fileContent: { dataUrl: '' }
    };
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
