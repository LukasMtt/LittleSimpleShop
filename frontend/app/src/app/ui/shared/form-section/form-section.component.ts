import { Component, computed, input } from '@angular/core';
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
  control = input<FormControl | undefined | null>(undefined);
  id = input<string>('');
  selectOptions = input<{ value: any; label: string }[] | null>(null);
  type = input<'text' | 'email' | 'select' | 'checkbox'>('text');
  labelResource = input<string>('');
  validationFailResourcesMap = input<{ key: string; value: string }[]>([]);
  performValidation = input<boolean>(true);
  isRequired = input<boolean>(false);

  labelText = computed(() => {
    return `${this.res(this.labelResource())}${
      this.isRequired() ? '*' : ` (${this.res('FORM_ROW_OPTIONAL')})`
    }`;
  });

  public getErrorMessage(error: ValidationErrors | null): string {
    if (!error) {
      return '';
    }
    if (
      !this.validationFailResourcesMap() ||
      this.validationFailResourcesMap().length < 1
    ) {
      return '';
    }

    const errorMessageList: string[] = [];
    for (const errorKey in error) {
      this.validationFailResourcesMap().filter((x) => {
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
