import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { MetadataShopDTO } from '../models/api/metadata-shop.dto';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getMetadata(): Observable<MetadataShopDTO> {
    return this.httpClient.get<MetadataShopDTO>(
      this.endpointResolveService.buildUrl(EndpointItem.GetMetadata, [])
    );
  }
}
