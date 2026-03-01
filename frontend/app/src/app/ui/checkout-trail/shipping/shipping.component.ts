import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { ShipmentService } from '../../../services/shipment.service';
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
    public shipmentService: ShipmentService,
    private countryService: CountryService
  ) {
    super();
    this.shipmentFormGroup = this.shipmentService.getShipmentFormGroup();
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
