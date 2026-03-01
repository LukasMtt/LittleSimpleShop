import { Component, computed, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { BaseComponent } from '../../shared/base.component';
import { PaymentStripeService } from '../../../services/payment.stripe.service';
import { ShipmentService } from '../../../services/shipment.service';
import { FormGroup } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { CartModel } from '../../../models/component/cart.model';
import { CurrencyPipe } from '@angular/common';
import { TextBadgeComponent } from '../../shared/text-badge/text-badge.component';
import { MetadataService } from '../../../services/metadata.service';
import { ShippingService } from '../../../services/shipping.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payment',
  imports: [ButtonComponent, CurrencyPipe, TextBadgeComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent extends BaseComponent {
  public cart = signal<CartModel | undefined>(undefined);

  public totalPriceCart = computed(() => {
    if (this.cart() !== undefined) {
      return this.cartService.getCartPriceSum();
    }
    return 'invalid sum';
  });
  paymentBadgesTextList = signal<string[]>([]);

  private shipmentFormGroup: FormGroup;

  constructor(
    public shipmentService: ShipmentService,
    private paymentStripeService: PaymentStripeService,
    private cartService: CartService,
    metaDataService: MetadataService,
    shippingService: ShippingService
  ) {
    super();
    this.shipmentFormGroup = this.shipmentService.getShipmentFormGroup();
    this.cart.set(this.cartService.cartReadonly());

    forkJoin([
      metaDataService.getMetadata(),
      shippingService.getShippingTimeEstimation()
    ]).subscribe(([metadata, estimation]) => {
      const textList: string[] = [];
      textList.push(
        this.res('ORDER_RETURN_TIMESPAN').replace(
          '{X}',
          metadata.shippingReturnThreshold
        )
      );
      textList.push(
        this.res('SHIPPING_TIME_ESTIMATION_STRING')
          .replace('{X}', estimation.minDays)
          .replace('{Y}', estimation.maxDays)
      );
      textList.push(this.res('SECURE_CHECKOUT'));
      this.paymentBadgesTextList.set(textList);
    });
  }

  public checkout() {
    if (!this.shipmentFormGroup.valid) {
      console.log('Shipment form is not valid.');
      return;
    }
    this.paymentStripeService.checkout();
  }
}
