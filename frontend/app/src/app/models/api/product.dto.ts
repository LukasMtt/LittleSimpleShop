import { CategoryDTO } from './category.dto';
import { PublicImageDTO } from './public-image.dto';

export interface ProductDTO {
  id: number;
  name: string;
  images: PublicImageDTO[];
  description: string;
  category: CategoryDTO;
  price: number;
  isInSale: boolean;
}
