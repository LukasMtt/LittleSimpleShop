import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbCheckoutComponent } from '../shared/breadcrumb-checkout/breadcrumb-checkout.component';

@Component({
  selector: 'app-checkout-trail',
  standalone: true,
  imports: [RouterModule, BreadcrumbCheckoutComponent],
  templateUrl: './checkout-trail.component.html',
  styleUrl: './checkout-trail.component.css'
})
export class CheckoutTrailComponent implements OnInit {
  currentStep: number = 0;
  steps = [
    { stepDisplayValue: 'BREADCRUMB_CART', position: 0 },
    { stepDisplayValue: 'BREADCRUMB_SHIPPING', position: 1 },
    { stepDisplayValue: 'BREADCRUMB_PAYMENT', position: 2 }
  ];
  stepsRouteEndpoints = [
    { subRoute: 'cart', position: 0 },
    { subRoute: 'shipping', position: 1 },
    { subRoute: 'payment', position: 2 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate([
      'checkout-trail',
      { outlets: { checkout: ['cart'] } }
    ]);
  }

  updateCheckoutStep($step: number) {
    var endpoint =
      this.stepsRouteEndpoints.find((x) => x.position === $step)?.subRoute ??
      '';

    this.router.navigate([
      'checkout-trail',
      { outlets: { checkout: [endpoint] } }
    ]);
  }
}
