import { CartItemProductInput } from './cart-item-product.input';

export interface CartItemInput {
  product: CartItemProductInput;
  count: number;
}
