import { Component, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { CheckoutService } from '../../../services/checkout.service';
import { BaseComponent } from '../../shared/base.component';
import { CountryService } from '../../../services/country.service';
import { ShipmentFormModel } from '../../../models/forms/shipment-form.model';
import { FormSectionButtonSelectComponent } from '../../shared/form-section-button-select/form-section-button-select.component';
import { ShippingService } from '../../../services/shipping.service';

@Component({
  selector: 'app-shipping',
  imports: [
    ReactiveFormsModule,
    FormSectionComponent,
    FormSectionButtonSelectComponent
  ],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent extends BaseComponent {
  public shipmentFormGroup: FormGroup<ShipmentFormModel>;

  countryList = signal<{ value: string; label: string }[]>([]);
  shippingProviders = signal<
    { value: number; label: string; subLabel: string }[]
  >([]);

  constructor(
    public checkoutService: CheckoutService,
    private countryService: CountryService,
    shippingService: ShippingService
  ) {
    super();
    this.shipmentFormGroup = this.checkoutService.getShipmentFormGroup();

    // todo fetch backend list
    this.countryList.set(
      this.countryService.getCountryList().map((country) => ({
        value: country.countryShort,
        label: country.countryLong
      }))
    );
    shippingService.getShippingProviders().subscribe((providerList) => {
      this.shippingProviders.set(
        providerList.map((provider) => ({
          value: provider.valueInt,
          label: this.res(
            `SHIPPING_PROVIDER_${provider.valueText?.toUpperCase()}`
          ),
          subLabel: provider.costText
        }))
      );
    });
  }
}
