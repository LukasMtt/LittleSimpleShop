import { Component, computed, input } from '@angular/core';
import { BaseComponent } from './base.component';
import { ValidationErrors } from '@angular/forms';

@Component({
  template: ''
})
export class BaseFormSectionComponent extends BaseComponent {
  id = input<string>('');
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
