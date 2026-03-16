import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countryList: { countryLong: string; countryShort: string }[] = [
    { countryLong: 'Deutschland', countryShort: 'DEU' },
    { countryLong: 'Österreich', countryShort: 'AUT' },
    { countryLong: 'Schweiz', countryShort: 'CHE' }
  ];

  public getCountryList() {
    return this.countryList;
  }
}
