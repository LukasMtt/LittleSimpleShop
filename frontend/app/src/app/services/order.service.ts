import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  //todo obviously not ready
  getOrderInformation(): Observable<null> {
    return this.httpClient.get<null>(
      this.endpointResolveService.buildUrl(EndpointItem.GetOrderInformation, [])
    );
  }
}
