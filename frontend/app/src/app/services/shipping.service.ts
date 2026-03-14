import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { ShippingEstimationDTO } from '../models/api/shipping-estimation.dto';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getShippingProviders(): Observable<
    { valueInt: number; valueText: string; costText: string }[]
  > {
    return this.httpClient.get<
      { valueInt: number; valueText: string; costText: string }[]
    >(
      this.endpointResolveService.buildUrl(EndpointItem.GetShippingProvider, [])
    );
  }

  /* current implementation does not consider a real delivery API so params not meaningful */
  getShippingTimeEstimation(): Observable<ShippingEstimationDTO> {
    return this.httpClient.get<ShippingEstimationDTO>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetShippingTimeEstimation,
        [{ key: 'shippingProvider', value: '0' }]
      )
    );
  }
}
