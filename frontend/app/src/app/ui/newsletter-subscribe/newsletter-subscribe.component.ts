import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BaseComponent } from '../shared/base.component';
import { ButtonComponent } from '../shared/button/button.component';
import { FormSectionComponent } from '../shared/form-section/form-section.component';
import { HttpClient } from '@angular/common/http';
import {
  EndpointItem,
  EndpointResolveService
} from '../../services/endpoint.resolve.service';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';

@Component({
  selector: 'app-newsletter-subscribe',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormSectionComponent,
    SnackbarComponent
  ],
  templateUrl: './newsletter-subscribe.component.html',
  styleUrl: './newsletter-subscribe.component.css'
})
export class NewsletterSubscribeComponent extends BaseComponent {
  triggerSnackbar = signal<boolean | undefined>(undefined);
  textSnackbar = signal<string>('');

  newsletterSubscribeFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {
    super();
  }

  public onSubmit() {
    this.setFormControlsToDirty();
    if (this.newsletterSubscribeFormGroup.valid) {
      this.httpClient
        .post<boolean>(
          this.endpointResolveService.buildUrl(
            EndpointItem.PostNewsletterSubscriber,
            [
              {
                key: 'email',
                value:
                  this.newsletterSubscribeFormGroup.controls['email'].value ||
                  ''
              }
            ]
          ),
          {},
          { withCredentials: true }
        )
        .subscribe((_) => {
          this.textSnackbar.set(this.res('SUBSCRIBE_NEWSLETTER_INFO'));
          this.toggleTriggerSnackbar();
        });
    } else {
      console.log('Invalid form data!');
    }
  }

  public setFormControlsToDirty() {
    Object.keys(this.newsletterSubscribeFormGroup.controls).forEach((key) => {
      this.newsletterSubscribeFormGroup.get(key)?.markAsDirty();
    });
  }

  private toggleTriggerSnackbar() {
    if (this.triggerSnackbar() !== undefined) {
      this.triggerSnackbar.update((value) => !value);
    } else {
      this.triggerSnackbar.set(true);
    }
  }
}
