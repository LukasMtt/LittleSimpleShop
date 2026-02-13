import { CardInput } from './card.input';

export interface ProductCardInput extends CardInput {
  description: string;
  price: number;
  isInSale: boolean;
}
