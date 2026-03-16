import { Routes } from '@angular/router';
import { ProductBoardComponent } from './ui/product/product-board/product-board.component';
import { ProductShowComponent } from './ui/product/product-show/product-show.component';
import { AboutComponent } from './ui/about/about.component';
import { ImprintComponent } from './ui/imprint/imprint.component';
import { CartShowComponent } from './ui/cart/cart-show/cart-show.component';
import { LandingPageComponent } from './ui/landing-page/landing-page.component';
import { CheckoutTrailComponent } from './ui/checkout-trail/checkout-trail.component';
import { ShippingComponent } from './ui/checkout-trail/shipping/shipping.component';
import { PaymentComponent } from './ui/checkout-trail/payment/payment.component';
import { CheckoutSuccessComponent } from './ui/checkout-success/checkout-success.component';
import { CheckOrderStateComponent } from './ui/check-order-state/check-order-state.component';
import { orderGuard } from './guards/order.guard';
import { FaqComponent } from './ui/faq/faq.component';
import { ContactComponent } from './ui/contact/contact.component';
import { ErrorComponent } from './ui/error/error.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'shop', redirectTo: '' },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'error', component: ErrorComponent },

  {
    path: 'checkout-trail',
    component: CheckoutTrailComponent,
    children: [
      { path: 'cart', component: CartShowComponent, outlet: 'checkout' },
      { path: 'shipping', component: ShippingComponent, outlet: 'checkout' },
      { path: 'payment', component: PaymentComponent, outlet: 'checkout' }
    ]
  },
  {
    path: 'checkout-success/:orderToken',
    component: CheckoutSuccessComponent,
    canActivate: [orderGuard]
  },
  {
    path: 'check-order-state/:orderToken',
    component: CheckOrderStateComponent,
    canActivate: [orderGuard]
  },

  {
    path: 'products/:categoryId/:categoryType',
    component: ProductBoardComponent
  },
  { path: 'showProduct/:productId', component: ProductShowComponent },
  { path: '**', component: ErrorComponent }
];

export enum RouteEndpointType {
  Products = 'products',
  ShowProduct = 'showProduct'
}
