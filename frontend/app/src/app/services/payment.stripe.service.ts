import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { AppConfigService } from './app.config.service';
import { lastValueFrom } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class PaymentStripeService {
  private stripePromise;

  constructor(
    private httpClient: HttpClient,
    appConfigService: AppConfigService,
    private endpointResolveService: EndpointResolveService,
    private cartService: CartService
  ) {
    this.stripePromise = loadStripe(
      appConfigService.getConfigProperty('stripePublicKey')
    );
  }

  public async checkout() {
    const cartModel = {
      cartItems: this.cartService.getCartObservable().value.items.map((x) => ({
        productId: x.product?.id ?? 0,
        count: x.count
      }))
    };
    const session: any = await lastValueFrom(
      this.httpClient.post(
        this.endpointResolveService.buildUrl(
          EndpointItem.CreateCheckoutSession,
          []
        ),
        cartModel
      )
    );

    const stripe = await this.stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });
      if (error) {
        console.error('Stripe checkout error:', error.message);
      }
    }
  }
}
