import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';

@Component({
    selector: 'app-form-section',
    imports: [ReactiveFormsModule],
    templateUrl: './form-section.component.html',
    styleUrl: './form-section.component.css'
})
export class FormSectionComponent extends BaseComponent {
  @Input() control: FormControl | undefined | null;

  @Input() id: string = '';
  @Input() selectOptions: { value: any; label: string }[] | null = null;
  @Input() type: 'text' | 'email' | 'select' | 'checkbox' = 'text';
  @Input() labelResource: string = '';

  @Input() validationFailResourcesMap: { key: string; value: string }[] = [];
  @Input() performValidation: boolean = true;
  @Input() isRequired: boolean = false;

  public getLabelText(): string {
    return `${this.res(this.labelResource)}${
      this.isRequired ? '*' : ` (${this.res('FORM_ROW_OPTIONAL')})`
    }`;
  }

  public getErrorMessage(error: ValidationErrors | null): string {
    if (!error) {
      return '';
    }
    if (
      !this.validationFailResourcesMap ||
      this.validationFailResourcesMap.length < 1
    ) {
      return '';
    }

    const errorMessageList: string[] = [];
    for (const errorKey in error) {
      this.validationFailResourcesMap.filter((x) => {
        if (x.key === errorKey) {
          errorMessageList.push(this.res(x.value));
        }
      });
    }

    if (errorMessageList.length > 0) {
      return errorMessageList.join(' ');
    }
    return '';
  }
}
