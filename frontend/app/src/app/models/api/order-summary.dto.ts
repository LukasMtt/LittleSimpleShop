import { CartModel } from '../component/cart.model';
import { CheckoutDTO } from './checkout.dto';

export interface OrderSummaryDTO {
  state: string;
  orderDate: string;
  orderEstimatedDeliveryDate: string;
  shippingProvider: string;
  shippingCost: number;
  shippingProviderOrderId: string;
  shippingProviderTrackingLink: string;
  cart: CartModel;
  shipmentTarget: CheckoutDTO;
}
