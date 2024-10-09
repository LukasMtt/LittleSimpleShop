import { Component } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";
import { ProductService } from '../services/product.service';
import { RouteEndpointType } from '../app.routes';
import { ProductCategory } from '../models/product.category.model';

@Component({
  selector: 'app-category-board',
  standalone: true,
  imports: [CardBoardComponent],
  templateUrl: './category-board.component.html'
})
export class CategoryBoardComponent {
  routeType  = RouteEndpointType.Products.toString()  
  categoryList: ProductCategory[] = []

  constructor(public productService: ProductService) {
    productService.getAllCategories().subscribe((data) => 
       { 
        this.categoryList = data;
       });
  }
}
