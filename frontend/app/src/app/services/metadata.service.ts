import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { MetadataShop } from '../models/metadata.shop.model';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getMetadata(): Observable<MetadataShop> {
    return this.httpClient.get<MetadataShop>(
      this.endpointResolveService.buildUrl(EndpointItem.GetMetadata, [])
    );
  }
}
