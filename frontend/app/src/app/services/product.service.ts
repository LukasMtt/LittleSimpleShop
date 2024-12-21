import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/product.category.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { PaginationState } from '../models/pagination.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getAllCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(
      this.endpointResolveService.buildUrl(EndpointItem.GetAllCategories, [])
    );
  }

  getAllProducts(paginationState: PaginationState): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProducts,
        paginationState.convertToKeyValueList()
      )
    );
  }

  getAllProductsInSale(
    paginationState: PaginationState
  ): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProductsInSale,
        paginationState.convertToKeyValueList()
      )
    );
  }

  getAllProductsById(
    productCategoryId: number,
    paginationState: PaginationState
  ): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProductsByCategoryId,
        [{ key: 'categoryId', value: `${productCategoryId}` }].concat(
          paginationState.convertToKeyValueList()
        )
      )
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(
      this.endpointResolveService.buildUrl(EndpointItem.GetProductById, [
        { key: 'productId', value: `${productId}` }
      ])
    );
  }

  getProductsByIds(productIdList: number[]): Observable<Product[]> {
    return this.httpClient.post<Product[]>(
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
