import { Component, Input, OnInit } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { ProductService } from '../services/product.service';
import { RouteEndpointType } from '../app.routes';

@Component({
  selector: 'app-product-board',
  standalone: true,
  imports: [CardBoardComponent, MatPaginator],
  templateUrl: './product-board.component.html',
  styleUrl: './product-board.component.css'
})
export class ProductBoardComponent implements OnInit{
  @Input({required: true}) categoryId!: string
  categoryIdNum!: number
  routeType  = RouteEndpointType.ShowProduct.toString()  

  constructor(public productService: ProductService) {
  }

  ngOnInit() {
    this.categoryIdNum = Number(this.categoryId)
  }

  onChangePage(event: PageEvent) {
    console.log(event);
  }
}
