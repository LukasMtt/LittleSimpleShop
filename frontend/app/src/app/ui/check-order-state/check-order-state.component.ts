import { Component, computed, signal } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartItemModel } from '../../models/component/cart-item.model';
import { ProductService } from '../../services/product.service';
import { CheckoutDTO } from '../../models/api/checkout.dto';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-check-order-state',
  imports: [CurrencyPipe],
  templateUrl: './check-order-state.component.html',
  styleUrl: './check-order-state.component.css'
})
export class CheckOrderStateComponent extends BaseComponent {
  orderToken = signal<string>('');
  orderDate = signal<string>('');
  currentState = signal<string>('');
  estimatedDelivery = signal<string>('');
  checkoutInfo = signal<CheckoutDTO | undefined>(undefined);
  cartItems = signal<CartItemModel[]>([]);
  shippingProvider = signal<string>('');
  shippingProviderOrderId = signal<string>('');
  shippingProviderTrackingLink = signal<string>('');

  cartItemsTotalPrice = computed(() => {
    if (this.cartItems().length < 1) return 0;
    return this.cartItems()
      .map((x) => x.amount * (x.product?.price ?? 0))
      .reduce((acc, cur) => acc + cur);
  });

  constructor(
    activatedRoute: ActivatedRoute,
    orderService: OrderService,
    productService: ProductService
  ) {
    super();

    activatedRoute.params.subscribe((params) => {
      this.orderToken.set(params['orderToken']);
    });

    orderService.getOrderInformation(this.orderToken()).subscribe({
      next: (result) => {
        this.currentState.set(result.state);
        this.orderDate.set(result.orderDate);
        this.estimatedDelivery.set(result.orderEstimatedDeliveryDate);

        this.cartItems.set(result.cart.cartItems);
        productService
          .getProductsByIds(
            result.cart.cartItems.map((x) => x.productId).filter((x) => x)
          )
          .subscribe((products) => {
            const cartItems: CartItemModel[] = [];
            products.forEach((product) => {
              const amount = result.cart.cartItems.find(
                (x) => x.productId == product.id
              )?.amount;
              if (product && amount) {
                cartItems.push({
                  productId: product.id,
                  product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: undefined
                  },
                  amount: amount
                });
              }
            });
            this.cartItems.set(cartItems);
          });
        this.shippingProvider.set(result.shippingProvider);
        this.shippingProviderOrderId.set(result.shippingProviderOrderId);
        this.shippingProviderTrackingLink.set(
          result.shippingProviderTrackingLink
        );
        this.checkoutInfo.set(result.shipmentTarget);
      }
    });
  }
}
