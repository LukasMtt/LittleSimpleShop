import { Injectable } from '@angular/core';
import { ProductDTO } from '../models/api/product.dto';
import { CategoryDTO } from '../models/api/category.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getAllCustomCategories(): Observable<CategoryDTO[]> {
    return this.httpClient.get<CategoryDTO[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllCustomCategories,
        []
      )
    );
  }

  getAllProducts(
    paginationState: PaginationStateModel
  ): Observable<ProductDTO[]> {
    return this.httpClient.get<ProductDTO[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProducts,
        paginationState.convertToKeyValueList()
      )
    );
  }

  getAllProductsInSale(
    paginationState: PaginationStateModel
  ): Observable<ProductDTO[]> {
    return this.httpClient.get<ProductDTO[]>(
      this.endpointResolveService.buildUrl(
        EndpointItem.GetAllProductsInSale,
        paginationState.convertToKeyValueList()
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
          paginationState.convertToKeyValueList()
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
