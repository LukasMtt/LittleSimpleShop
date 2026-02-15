import { DisplayImageInput } from './display-image.input';

export interface CardInput {
  image: DisplayImageInput;
  subText?: string;
  gridRowStartEnd?: [string, string];
  cardLink?: string;
}
