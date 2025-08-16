import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countryList: { countryLong: string; countryShort: string }[] = [
    { countryLong: 'Germany', countryShort: 'DEU' },
    { countryLong: 'Austria', countryShort: 'AUT' },
    { countryLong: 'Switzerland', countryShort: 'CHE' }
  ];

  public getCountryList() {
    return this.countryList;
  }
}
