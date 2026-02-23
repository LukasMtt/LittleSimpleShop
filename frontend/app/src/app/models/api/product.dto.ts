import { CategoryDTO } from './category.dto';
import { PublicImageDTO } from './public-image.dto';

export interface ProductDTO {
  id: number;
  name: string;
  images: PublicImageDTO[];
  shortDescription: string;
  highlightDescriptions: string[];
  detailDescription: string;
  safetyUsageDescription: string;
  category: CategoryDTO;
  price: number;
  isInSale: boolean;
  isInStock: boolean;
}
