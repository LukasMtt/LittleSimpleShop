import { FormControl, FormGroup } from '@angular/forms';

export interface ShipmentFormModel {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  companyName: FormControl<string | null>;
  email: FormControl<string | null>;
  isNewsletterActivated: FormControl<boolean | null>;
  phone: FormControl<string | null>;
  address: FormGroup<{
    street: FormControl<string | null>;
    number: FormControl<string | null>;
    addition: FormControl<string | null>;
    city: FormControl<string | null>;
    country: FormControl<number | null>;
    zip: FormControl<string | null>;
  }>;
  shippingProvider: FormControl<number | null>;
}
