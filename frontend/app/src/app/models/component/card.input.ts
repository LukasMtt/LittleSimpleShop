import { DisplayImageInput } from './display-image.input';

export interface CardInput {
  id: number;
  name: string;
  image: DisplayImageInput;
  //todo: maybe one commit: only data props without style props separated? Or how do we determine how to bundle/create models?
  gridRowStartEnd?: [string, string] | undefined;
  cardLink: string | undefined;
}
