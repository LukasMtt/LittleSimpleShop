import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-cart-checkout-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatIcon, MatTooltip],
  templateUrl: './cart-checkout-form.component.html',
  styleUrl: './cart-checkout-form.component.css'
})
export class CartCheckoutFormComponent {
  checkoutFormGroup = new FormGroup(
    {
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormGroup( {
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        zip: new FormControl('', Validators.required)
      })
    }
  )

  onSubmit() {
    this.setFormControlsToDirty();
    if (this.checkoutFormGroup.valid) {
      console.log("Proceed with payment.");
    }
    else {
      console.log("Invalid form data!");
    }
  }

  setFormControlsToDirty() {
    Object.keys(this.checkoutFormGroup.controls).forEach(key => {
      this.checkoutFormGroup.get(key)?.markAsDirty();
    });
    Object.keys(this.checkoutFormGroup.controls.address.controls).forEach(key => {
      this.checkoutFormGroup.controls.address.get(key)?.markAsDirty();
    });
  }
}
