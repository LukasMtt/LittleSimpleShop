import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { AppConfigService } from './app.config.service';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { CheckoutService } from './checkout.service';
import { CheckoutDTO } from '../models/api/checkout.dto';

@Injectable({ providedIn: 'root' })
export class PaymentStripeService {
  private stripePromise;

  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService,
    private checkoutService: CheckoutService,
    appConfigService: AppConfigService
  ) {
    this.stripePromise = loadStripe(
      appConfigService.getConfigProperty('stripePublicKey')
    );
  }

  public getCheckoutSessionObservable(): Observable<any> {
    const discountCodeFormGroup =
      this.checkoutService.getDiscountCodeFormGroup();
    const shipmentFormGroup = this.checkoutService.getShipmentFormGroup();
    const checkoutModel: CheckoutDTO = {
      firstName: shipmentFormGroup.controls.firstName?.value ?? '',
      lastName: shipmentFormGroup.controls.lastName?.value ?? '',
      companyName: shipmentFormGroup.controls.companyName?.value ?? '',
      email: shipmentFormGroup.controls.email?.value ?? '',
      isNewsletterActivated:
        shipmentFormGroup.controls.isNewsletterActivated?.value ?? false,
      phone: shipmentFormGroup.controls.phone?.value ?? '',
      discountCode: discountCodeFormGroup.controls.code?.value ?? '',
      address: {
        street: shipmentFormGroup.controls.address.controls.street?.value ?? '',
        number: shipmentFormGroup.controls.address.controls.number?.value ?? '',
        addition:
          shipmentFormGroup.controls.address.controls.addition?.value ?? '',
        city: shipmentFormGroup.controls.address.controls.city?.value ?? '',
        country:
          shipmentFormGroup.controls.address.controls.country?.value ?? 0,
        zip: shipmentFormGroup.controls.address.controls.zip?.value ?? ''
      },
      shippingProvider: shipmentFormGroup.controls.shippingProvider.value ?? 0
    };
    return this.httpClient.post<string>(
      this.endpointResolveService.buildUrl(
        EndpointItem.CreateCheckoutSession,
        []
      ),
      checkoutModel
    );
  }

  public async checkout(sessionId: string) {
    const stripe = await this.stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });
      if (error) {
        console.error('Stripe checkout error:', error.message);
      }
    }
  }
}
