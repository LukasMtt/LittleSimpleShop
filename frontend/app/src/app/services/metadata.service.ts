import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
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

  private metaDataCache: Observable<MetadataShopDTO> | undefined;

  getMetadata(): Observable<MetadataShopDTO> {
    if (!this.metaDataCache) {
      this.metaDataCache = this.httpClient
        .get<MetadataShopDTO>(
          this.endpointResolveService.buildUrl(EndpointItem.GetMetadata, [])
        )
        .pipe(shareReplay(1));
    }
    return this.metaDataCache;
  }
}
