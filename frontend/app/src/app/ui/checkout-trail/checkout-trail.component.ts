import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbCheckoutComponent } from '../shared/breadcrumb-checkout/breadcrumb-checkout.component';
import { ShipmentService } from '../../services/shipment.service';
import { FormGroup } from '@angular/forms';
import { UrlHelper } from '../../misc/url.helper';

@Component({
  selector: 'app-checkout-trail',
  standalone: true,
  imports: [RouterModule, BreadcrumbCheckoutComponent],
  templateUrl: './checkout-trail.component.html',
  styleUrl: './checkout-trail.component.css'
})
export class CheckoutTrailComponent implements OnInit {
  currentStep: number = 0;
  shipmentFormGroup: FormGroup;
  steps = [
    {
      stepDisplayValue: 'BREADCRUMB_CART',
      subRoute: 'cart',
      position: 0,
      makeStepAccessible: true
    },
    {
      stepDisplayValue: 'BREADCRUMB_SHIPPING',
      subRoute: 'shipping',
      position: 1,
      makeStepAccessible: true
    },
    {
      stepDisplayValue: 'BREADCRUMB_PAYMENT',
      subRoute: 'payment',
      position: 2,
      makeStepAccessible: this.shipmentService.getShipmentFormGroup().valid
    }
  ];

  constructor(
    private router: Router,
    private shipmentService: ShipmentService
  ) {
    this.shipmentFormGroup = this.shipmentService.getShipmentFormGroup();
    this.shipmentFormGroup.valueChanges.subscribe(() => {
      let shippingStep = this.steps.find((x) => x.subRoute === 'payment');
      if (shippingStep) {
        shippingStep.makeStepAccessible = this.shipmentFormGroup.valid;
      }
      this.steps = [...this.steps];
    });
  }

  public ngOnInit(): void {
    this.initStepSetup();
  }

  public updateCheckoutStep($step: number) {
    let step = this.steps.find((x) => x.position === $step);

    this.router.navigate([
      'checkout-trail',
      { outlets: { checkout: [step?.subRoute ?? ''] } }
    ]);
  }

  private initStepSetup(): void {
    const currentUrl = this.router.url;
    const step = this.steps.find((x) => {
      let subOutlet = UrlHelper.getSubOutletTarget(currentUrl);
      return x.subRoute == (subOutlet.length > 0 ? subOutlet[0] : '');
    });
    if (step) {
      step.makeStepAccessible = true;
      this.steps = [...this.steps];
      this.currentStep = step.position;
      this.updateCheckoutStep(step.position);
    } else {
      this.currentStep = 0;
      this.updateCheckoutStep(0);
    }
  }
}
