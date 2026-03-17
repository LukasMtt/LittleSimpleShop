import { PublicImageDTO } from './public-image.dto';

export interface ProductDTO {
  id: number;
  name: string;
  images: PublicImageDTO[];
  shortDescription: string;
  highlightDescriptions: string[];
  detailDescription: string;
  safetyUsageDescription: string;
  price: number;
  isInSale: boolean;
  isInStock: boolean;
}
