import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-checkout-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatIcon],
  templateUrl: './cart-checkout-form.component.html',
  styleUrl: './cart-checkout-form.component.css'
})
export class CartCheckoutFormComponent {
  checkoutFormGroup = new FormGroup(
    {
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      address: new FormGroup( {
        street: new FormControl(''),
        number: new FormControl(''),
        city: new FormControl(''),
        zip: new FormControl('')
      })
    }
  )
}
