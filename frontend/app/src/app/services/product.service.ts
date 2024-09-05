import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/product-category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getCategories(): ProductCategory[] {
    return [
      { id: 1, name: "Cups", overviewImage: "img1"},
      { id: 2, name: "Plates", overviewImage: "img2"}
    ]
  }

  getProducts(productCategoryId: number): Product[] {
    return [
      { id: 1, name: "Nice Cup", description: "This is a nice cup", overviewImage: "", category: { id: 1, name: "Cups", overviewImage: "img1"}},
      { id: 2, name: "Super Cup", description: "This is a nice cup", overviewImage: "", category: { id: 1, name: "Cups", overviewImage: "img1"}},
      { id: 3, name: "Great Cup", description: "This is a nice cup", overviewImage: "", category: { id: 1, name: "Cups", overviewImage: "img1"}},
      { id: 4, name: "Nice Plate", description: "This is a nice plate", overviewImage: "", category: { id: 2, name: "Plates", overviewImage: "img2"}},
      { id: 5, name: "Great Plate", description: "This is a nice plate", overviewImage: "", category: { id: 2, name: "Plates", overviewImage: "img2"}},
    ].filter((x) => x.category.id === productCategoryId)
  }
}
