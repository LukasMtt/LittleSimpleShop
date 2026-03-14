import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormSectionComponent } from '../base-form-section.component';

@Component({
  selector: 'app-form-section',
  imports: [ReactiveFormsModule],
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.css'
})
export class FormSectionComponent extends BaseFormSectionComponent {
  control = input<FormControl | undefined | null>(undefined);
  selectOptions = input<{ value: any; label: string }[] | null>(null);
  type = input<'text' | 'email' | 'select' | 'checkbox'>('text');
}
