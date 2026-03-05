import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { OrderSummaryDTO } from '../models/api/order-summary.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getOrderExists(orderToken: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      this.endpointResolveService.buildUrl(EndpointItem.GetOrderExists, [
        {
          key: 'orderToken',
          value: orderToken
        }
      ])
    );
  }

  getOrderInformation(orderToken: string): Observable<OrderSummaryDTO> {
    return this.httpClient.get<OrderSummaryDTO>(
      this.endpointResolveService.buildUrl(EndpointItem.GetOrderInformation, [
        {
          key: 'orderToken',
          value: orderToken
        }
      ])
    );
  }
}
