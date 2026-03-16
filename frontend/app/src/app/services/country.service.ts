import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  public getCountries(): Observable<string[]> {
    return this.httpClient.get<string[]>(
      this.endpointResolveService.buildUrl(EndpointItem.GetCountries, [])
    );
  }
}
