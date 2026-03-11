import { FormControl } from '@angular/forms';

export interface DiscountCodeFormModel {
  code: FormControl<string | null>;
}
