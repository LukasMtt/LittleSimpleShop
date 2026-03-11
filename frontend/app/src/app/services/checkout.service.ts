import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShipmentFormModel } from '../models/forms/shipment-form.model';
import { DiscountCodeFormModel } from '../models/forms/dicount-code-form.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private shipmentFormGroup: FormGroup<ShipmentFormModel> = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    companyName: new FormControl<string>(''),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    isNewsletterActivated: new FormControl<boolean>(false),
    phone: new FormControl<string>(''),
    address: new FormGroup({
      street: new FormControl<string>('', Validators.required),
      number: new FormControl<string>('', Validators.required),
      addition: new FormControl<string>(''),
      city: new FormControl<string>('', Validators.required),
      country: new FormControl<number | null>(null, Validators.required),
      zip: new FormControl<string>('', Validators.required)
    })
  });
  private discountCodeFormGroup: FormGroup<DiscountCodeFormModel> =
    new FormGroup({
      code: new FormControl('', [])
    });

  public getShipmentFormGroup(): FormGroup {
    return this.shipmentFormGroup;
  }

  public getDiscountCodeFormGroup(): FormGroup {
    return this.discountCodeFormGroup;
  }

  public setFormControlsToDirty() {
    Object.keys(this.shipmentFormGroup.controls).forEach((key) => {
      this.shipmentFormGroup.get(key)?.markAsDirty();
    });
    Object.keys(this.shipmentFormGroup.controls.address.controls).forEach(
      (key) => {
        this.shipmentFormGroup.controls.address.get(key)?.markAsDirty();
      }
    );
  }
}
