import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private shipmentFormGroup = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    address: new FormGroup({
      street: new FormControl<string>('', Validators.required),
      number: new FormControl<string>('', Validators.required),
      city: new FormControl<string>('', Validators.required),
      country: new FormControl<number | null>(null, Validators.required),
      zip: new FormControl<string>('', Validators.required)
    })
  });

  public getShipmentFormGroup(): FormGroup {
    return this.shipmentFormGroup;
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
