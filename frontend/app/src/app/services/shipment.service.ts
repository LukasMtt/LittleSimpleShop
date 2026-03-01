import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private shipmentFormGroup = new FormGroup({
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

  public getShipmentFormGroup(): FormGroup {
    return this.shipmentFormGroup;
  }

  public getAddressFormGroupFromShipmentFormGroup(): FormGroup {
    return this.shipmentFormGroup.get('address') as FormGroup;
  }

  public getFormControlFromShipmentFormGroup(key: string): FormControl | null {
    if (!this.shipmentFormGroup.contains(key)) {
      return null;
    }
    return this.shipmentFormGroup.get(key) as FormControl;
  }

  public getFormControlFromAddressShipmentFormGroup(
    key: string
  ): FormControl | null {
    if (!this.getAddressFormGroupFromShipmentFormGroup().contains(key)) {
      return null;
    }
    return this.getAddressFormGroupFromShipmentFormGroup().get(
      key
    ) as FormControl;
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
