import { CartItemProductModel as CartItemProductModel } from './cart-item-product.model';

export interface CartItemModel {
  product: CartItemProductModel;
  amount: number;
  productId: number;
}
