import { Injectable } from '@angular/core';
import { ProductDTO } from '../models/api/product.dto';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { PaginationStateModel } from '../models/misc/pagination-state.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  // consider migrating to more in-cache operations whenever possible - we can probably get rid of a lot of api calls
  private allProductsCache: Map<string, Observable<ProductDTO[]>> = new Map();

  getAllProducts(
    paginationState: PaginationStateModel
  ): Observable<ProductDTO[]> {
    const cacheKey = `${paginationState.pageOffset}-${paginationState.pageSize}`;
    if (!this.allProductsCache.has(cacheKey)) {
      this.allProductsCache.set(
        cacheKey,
        this.httpClient
          .get<
            ProductDTO[]
          >(this.endpointResolveService.buildUrl(EndpointItem.GetAllProducts, paginationState.getPropertyKeyValueList()))
          .pipe(shareReplay(1))
      );
    }
    return this.allProductsCache.get(cacheKey)!;
  }

  getAllProductsInSale(
    paginationState: PaginationStateModel
  ): Observable<ProductDTO[]> {
    return this.httpClient.get<ProductDTO[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProductsInSale,
        paginationState.getPropertyKeyValueList()
      )
    );
  }

  getAllProductsById(
    productCategoryId: number,
    paginationState: PaginationStateModel
  ): Observable<ProductDTO[]> {
    return this.httpClient.get<ProductDTO[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProductsByCategoryId,
        [{ key: 'categoryId', value: `${productCategoryId}` }].concat(
          paginationState.getPropertyKeyValueList()
        )
      )
    );
  }

  getProductById(productId: number): Observable<ProductDTO> {
    return this.httpClient.get<ProductDTO>(
      this.endpointResolveService.buildUrl(EndpointItem.GetProductById, [
        { key: 'productId', value: `${productId}` }
      ])
    );
  }

  getProductsByIds(productIdList: number[]): Observable<ProductDTO[]> {
    return this.httpClient.post<ProductDTO[]>(
      this.endpointResolveService.buildUrl(EndpointItem.GetProductsByIds, []),
      productIdList
    );
  }

  getProductsByIdCount(productCategoryId: number): Observable<number> {
    return this.httpClient.get<number>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetProductsByCategoryIdCount,
        [{ key: 'categoryId', value: `${productCategoryId}` }]
      )
    );
  }

  getAllProductsCount(): Observable<number> {
    return this.httpClient.get<number>(
      this.endpointResolveService.buildUrl(EndpointItem.GetAllProductsCount, [])
    );
  }

  getAllProductsInSaleCount(): Observable<number> {
    return this.httpClient.get<number>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProductsInSaleCount,
        []
      )
    );
  }
}
