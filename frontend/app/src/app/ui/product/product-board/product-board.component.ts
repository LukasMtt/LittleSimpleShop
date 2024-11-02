import { Component, Input, OnInit } from '@angular/core';
import { CardBoardComponent } from "../../shared/card-board/card.board.component";
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { ProductService } from '../../../services/product.service';
import { RouteEndpointType } from '../../../app.routes';
import { Product } from '../../../models/product.model';
import { Paginable } from '../../shared/paginable';
import { PaginationState } from '../../../models/pagination.state.model';
import { TemplateTypeCardBoardSubText } from '../../../enums/template-type-card-board-sub-text.enum';

@Component({
  selector: 'app-product-board',
  standalone: true,
  imports: [CardBoardComponent, MatPaginator],
  templateUrl: './product-board.component.html',
  styleUrl: './product-board.component.css'
})
export class ProductBoardComponent implements OnInit, Paginable {
  @Input({required: true}) categoryId!: string
  categoryIdNum!: number
  routeType = RouteEndpointType.ShowProduct.toString()
  paginationState = new PaginationState()  

  productList: Product[] = []
  productCount: number = 0
  templateTypeEnum = TemplateTypeCardBoardSubText;

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.categoryIdNum = Number(this.categoryId);
    this.paginationState.pageSize = 8;
    this.paginationState.pageOffset = 0;
    this.productService.getAllProductsById(this.categoryIdNum, this.paginationState).subscribe((data) => 
      { 
       this.productList = data;
      });
    this.productService.getProductsByIdCount(this.categoryIdNum).subscribe((data) => 
      { 
        this.productCount = data;
      });
  }

  onPageChange(event: PageEvent) {
    this.paginationState.pageOffset = event.pageIndex;
    this.productService.getAllProductsById(this.categoryIdNum, this.paginationState).subscribe((data) => 
      { 
       this.productList = data;
      });
  }

  getTotalDataLength(): number {
    return this.productCount;
  }
}
