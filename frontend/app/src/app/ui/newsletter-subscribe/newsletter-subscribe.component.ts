import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BaseComponent } from '../shared/base.component';
import { ButtonComponent } from '../shared/button/button.component';
import { FormSectionComponent } from '../shared/form-section/form-section.component';

@Component({
  selector: 'app-newsletter-subscribe',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormSectionComponent,
    FormSectionComponent
  ],
  templateUrl: './newsletter-subscribe.component.html',
  styleUrl: './newsletter-subscribe.component.css'
})
export class NewsletterSubscribeComponent extends BaseComponent {
  newsletterSubscribeFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  public onSubmit() {
    this.setFormControlsToDirty();
    if (this.newsletterSubscribeFormGroup.valid) {
      console.log('Proceed with subscription.');
    } else {
      console.log('Invalid form data!');
    }
  }

  public setFormControlsToDirty() {
    Object.keys(this.newsletterSubscribeFormGroup.controls).forEach((key) => {
      this.newsletterSubscribeFormGroup.get(key)?.markAsDirty();
    });
  }
}
