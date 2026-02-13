import { DisplayImageInput } from './display-image.input';

export interface CartItemProductInput {
  id: number;
  name: string;
  images: DisplayImageInput[];
  price: number;
}
