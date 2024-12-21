import { Component, Input, OnInit } from '@angular/core';
import { CardBoardComponent } from '../../shared/card-board/card.board.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProductService } from '../../../services/product.service';
import { RouteEndpointType } from '../../../app.routes';
import { Product } from '../../../models/product.model';
import { Paginable } from '../../shared/paginable';
import { PaginationState } from '../../../models/pagination.state.model';
import { TemplateTypeCardBoardSubText } from '../../../enums/template-type-card-board-sub-text.enum';
import { CategoryType } from '../../../enums/category-type.enum';

@Component({
  selector: 'app-product-board',
  standalone: true,
  imports: [CardBoardComponent, MatPaginator],
  templateUrl: './product-board.component.html',
  styleUrl: './product-board.component.css'
})
export class ProductBoardComponent implements OnInit, Paginable {
  @Input({ required: true }) categoryId!: string;
  @Input({ required: true }) categoryType!: string;

  categoryIdNum: number | undefined;
  categoryTypeEnum: CategoryType | undefined;
  routeType = RouteEndpointType.ShowProduct.toString();
  paginationState = new PaginationState();
  productList: Product[] = [];
  productCount: number = 0;
  templateTypeEnum = TemplateTypeCardBoardSubText;

  readonly pageSize = 8;
  readonly pageOffset = 0;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.categoryIdNum = Number(this.categoryId);
    this.categoryTypeEnum = (<any>CategoryType)[this.categoryType];
    this.paginationState.pageSize = this.pageSize;
    this.paginationState.pageOffset = this.pageOffset;

    this.initProductList();
  }

  initProductList() {
    if (this.categoryTypeEnum == CategoryType.Default && this.categoryIdNum) {
      this.loadProductsByCategoryId();
      this.productService
        .getProductsByIdCount(this.categoryIdNum)
        .subscribe((count) => {
          this.productCount = count;
        });
    }
    if (this.categoryTypeEnum == CategoryType.All && this.categoryTypeEnum) {
      this.loadAllProducts();
      this.productService.getAllProductsCount().subscribe((count) => {
        this.productCount = count;
      });
    }
    if (this.categoryTypeEnum == CategoryType.Sale && this.categoryTypeEnum) {
      this.loadAllProductsInSale();
      this.productService.getAllProductsInSaleCount().subscribe((count) => {
        this.productCount = count;
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.paginationState.pageOffset = event.pageIndex;
    if (this.categoryTypeEnum == CategoryType.Default && this.categoryIdNum) {
      this.loadProductsByCategoryId();
    }
    if (this.categoryTypeEnum == CategoryType.All && this.categoryTypeEnum) {
      this.loadAllProducts();
    }
    if (this.categoryTypeEnum == CategoryType.Sale && this.categoryTypeEnum) {
      this.loadAllProductsInSale();
    }
  }

  getTotalDataLength(): number {
    return this.productCount;
  }

  private loadProductsByCategoryId() {
    this.productService
      .getAllProductsById(this.categoryIdNum!, this.paginationState)
      .subscribe((productList) => {
        productList.forEach(
          (value) => (value.cardLink = this.getTargetRoute(value.id))
        );
        this.productList = productList;
      });
  }

  private loadAllProducts() {
    this.productService
      .getAllProducts(this.paginationState)
      .subscribe((productList) => {
        productList.forEach(
          (value) => (value.cardLink = this.getTargetRoute(value.id))
        );
        this.productList = productList;
      });
  }

  private loadAllProductsInSale() {
    this.productService
      .getAllProductsInSale(this.paginationState)
      .subscribe((productList) => {
        productList.forEach(
          (value) => (value.cardLink = this.getTargetRoute(value.id))
        );
        this.productList = productList;
      });
  }

  private getTargetRoute(id: number) {
    return `//${this.routeType}//${id}`;
  }
}
