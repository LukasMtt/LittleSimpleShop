import { DisplayImageInput } from './display-image.input';

export interface CartItemProductModel {
  id: number;
  name: string;
  image: DisplayImageInput | undefined;
  price: number | undefined;
}
