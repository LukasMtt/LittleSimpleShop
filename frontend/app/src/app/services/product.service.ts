import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/product-category.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpointUrl: string = ""

  constructor(private httpClient: HttpClient, appConfigService: AppConfigService) {
    this.endpointUrl = appConfigService.getConfigProperty("apiBaseEndpointUrl") + "shop/Product/"
   }

  getAllCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.endpointUrl + "GetAllCategories")
  }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.endpointUrl + "GetAllProducts")
  }

  getAllProductsById(productCategoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.endpointUrl + "GetAllProductsByCategoryId?categoryId=" + productCategoryId)
  }
}
