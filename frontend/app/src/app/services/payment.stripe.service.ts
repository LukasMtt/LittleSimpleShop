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
    const checkoutModel = {
      firstName: shipmentFormGroup.get('firstName')?.value,
      lastName: shipmentFormGroup.get('lastName')?.value,
      companyName: shipmentFormGroup.get('companyName')?.value,
      email: shipmentFormGroup.get('email')?.value,
      isNewsletterActivated: shipmentFormGroup.get('isNewsletterActivated')
        ?.value,
      phone: shipmentFormGroup.get('phone')?.value,
      discountCode: discountCodeFormGroup.get('code')?.value,
      address: {
        street: shipmentFormGroup.get('address.street')?.value,
        number: shipmentFormGroup.get('address.number')?.value,
        addition: shipmentFormGroup.get('address.addition')?.value,
        city: shipmentFormGroup.get('address.city')?.value,
        country: shipmentFormGroup.get('address.country')?.value,
        zip: shipmentFormGroup.get('address.zip')?.value
      }
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
