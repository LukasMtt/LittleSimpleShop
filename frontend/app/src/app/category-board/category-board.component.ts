import { Component } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";
import { ProductService } from '../services/product.service';
import { RouteEndpointType } from '../app.routes';

@Component({
  selector: 'app-category-board',
  standalone: true,
  imports: [CardBoardComponent],
  templateUrl: './category-board.component.html'
})
export class CategoryBoardComponent {
  routeType  = RouteEndpointType.Products.toString()  

  constructor(public productService: ProductService) {
  }
}
