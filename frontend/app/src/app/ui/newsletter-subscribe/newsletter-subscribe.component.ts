import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-newsletter-subscribe',
  standalone: true,
  imports: [MatIcon, MatTooltip, ReactiveFormsModule],
  templateUrl: './newsletter-subscribe.component.html',
  styleUrl: './newsletter-subscribe.component.css'
})
export class NewsletterSubscribeComponent {
  newsletterSubscribeFormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
    }
  )

  onSubmit() {
    this.setFormControlsToDirty();
    if (this.newsletterSubscribeFormGroup.valid) {
      console.log("Proceed with subscription.");
    }
    else {
      console.log("Invalid form data!");
    }
  }

  setFormControlsToDirty() {
    Object.keys(this.newsletterSubscribeFormGroup.controls).forEach(key => {
      this.newsletterSubscribeFormGroup.get(key)?.markAsDirty();
    });
  }
}
