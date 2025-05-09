import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.css'
})
export class FormSectionComponent extends BaseComponent {
  @Input() id: string = '';
  @Input() labelResource: string = '';
  @Input() validationFailResource: string = '';
  @Input() type: string = '';
  @Input() control: FormControl | undefined | null;
  @Input() performValidation: boolean = true;
}
