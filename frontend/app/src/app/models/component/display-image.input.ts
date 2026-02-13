import { FileContentInput } from './file-content.input';

export interface DisplayImageInput {
  id: number;
  fileId?: string;
  productId?: number;
  categoryId?: number;
  fileContent?: FileContentInput;
}
