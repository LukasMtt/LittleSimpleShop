import { PublicImageDTO } from './public-image.dto';

export interface CategoryDTO {
  id: number;
  name: string;
  images: PublicImageDTO[];
}
