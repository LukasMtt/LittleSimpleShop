import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { BaseComponent } from '../../shared/base.component';
import { PaymentStripeService } from '../../../services/payment.stripe.service';

@Component({
    selector: 'app-payment',
    imports: [ButtonComponent],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.css'
})
export class PaymentComponent extends BaseComponent {
  constructor(private paymentStripeService: PaymentStripeService) {
    super();
  }

  public checkout() {
    this.paymentStripeService.checkout();
  }
}
