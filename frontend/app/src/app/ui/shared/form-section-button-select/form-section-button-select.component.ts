import { Component, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormSectionComponent } from '../base-form-section.component';

@Component({
  selector: 'app-form-section-button-select',
  imports: [ReactiveFormsModule],
  templateUrl: './form-section-button-select.component.html',
  styleUrl: './form-section-button-select.component.css'
})
export class FormSectionButtonSelectComponent extends BaseFormSectionComponent {
  control = input<FormControl<number | null> | undefined>(undefined);
  selectOptions = input<
    { value: number; label: string; subLabel: string }[] | null
  >(null);

  selectedOption = signal<number | null>(null);

  constructor() {
    super();
    effect(() => {
      if (this.control()) {
        this.selectedOption.set(this.control()!.value);
      }
    });
  }

  public isSelected(optionValue: number) {
    return this.selectedOption() == optionValue;
  }

  public selectOption(optionValue: number) {
    this.selectedOption.set(optionValue);
    if (this.control()) {
      this.control()?.setValue(optionValue);
    }
  }
}
