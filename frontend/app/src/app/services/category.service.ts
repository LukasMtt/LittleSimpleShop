import { Injectable } from '@angular/core';
import { CategoryDTO } from '../models/api/category.dto';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  private allCustomCategoryCache: Observable<CategoryDTO[]> | undefined;

  getAllCustomCategories(): Observable<CategoryDTO[]> {
    if (!this.allCustomCategoryCache) {
      this.allCustomCategoryCache = this.httpClient
        .get<
          CategoryDTO[]
        >(this.endpointResolveService.buildUrl(EndpointItem.GetAllCustomCategories, []))
        .pipe(shareReplay(1));
    }
    return this.allCustomCategoryCache;
  }
}
