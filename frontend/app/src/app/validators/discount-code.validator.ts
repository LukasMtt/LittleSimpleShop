import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/* non functional yet, always fails - needs to implement as an async call to backend to check validity of code - do not forget to validate backend - side*/
export function discountCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return { discountCode: { value: control.value } };
  };
}
