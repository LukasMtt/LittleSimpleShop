import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { CheckoutService } from '../../../services/checkout.service';
import { BaseComponent } from '../../shared/base.component';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-shipping',
  imports: [ReactiveFormsModule, FormSectionComponent],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent extends BaseComponent {
  public shipmentFormGroup: FormGroup;

  readonly countryList: { countryLong: string; countryShort: string }[] = [];

  constructor(
    public checkoutService: CheckoutService,
    private countryService: CountryService
  ) {
    super();
    this.shipmentFormGroup = this.checkoutService.getShipmentFormGroup();
    this.countryList = this.countryService.getCountryList();
  }

  public getCountrySelectOptions(): { value: string; label: string }[] {
    if (!this.countryList || this.countryList.length === 0) {
      return [];
    }
    return this.countryList.map((country) => ({
      value: country.countryShort,
      label: country.countryLong
    }));
  }
}
