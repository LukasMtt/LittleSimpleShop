import { Component, Input, OnInit } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { ProductService } from '../services/product.service';
import { RouteEndpointType } from '../app.routes';
import { Product } from '../models/product.model';

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
  productList: Product[] = []

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.categoryIdNum = Number(this.categoryId)
    this.productService.getAllProductsById(this.categoryIdNum).subscribe((data) => 
      { 
       this.productList = data;
      });
  }

  onChangePage(event: PageEvent) {
    console.log(event);
  }
}
