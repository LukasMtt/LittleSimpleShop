import { Component, Input, OnInit } from '@angular/core';
import { CardBoardComponent } from '../../shared/card-board/card.board.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProductService } from '../../../services/product.service';
import { RouteEndpointType } from '../../../app.routes';
import { Paginable } from '../../shared/paginable';
import { PaginationStateModel } from '../../../models/misc/pagination-state.model';
import { CategoryType } from '../../../enums/category-type.enum';
import { ProductDTO } from '../../../models/api/product.dto';
import { CardInput } from '../../../models/component/card.input';
import { CurrencyPipe } from '@angular/common';

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

  cardInputList: CardInput[] = [];
  productCount: number = 0;
  categoryIdNum: number | undefined;
  categoryTypeEnum: CategoryType | undefined;
  routeType = RouteEndpointType.ShowProduct.toString();
  paginationState = new PaginationStateModel();

  readonly pageSize = 8;
  readonly pageOffset = 0;

  constructor(
    private productService: ProductService,
    private currencyPipe: CurrencyPipe
  ) {}

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

  private mapToModel(product: ProductDTO, targetRoute?: string): CardInput {
    return {
      image: {
        id: product.images[0].id,
        fileId: product.images[0].fileId,
        productId: product.id
      },
      subText: `${product.name ?? ''} \u00B7 ${this.currencyPipe.transform(product.price)}`,
      cardLink: targetRoute
    };
  }

  private loadProductsByCategoryId() {
    this.productService
      .getAllProductsById(this.categoryIdNum!, this.paginationState)
      .subscribe((products) => {
        this.cardInputList = products.map((product) =>
          this.mapToModel(product, this.getTargetRoute(product.id))
        );
      });
  }

  private loadAllProducts() {
    this.productService
      .getAllProducts(this.paginationState)
      .subscribe((products) => {
        this.cardInputList = products.map((product) =>
          this.mapToModel(product, this.getTargetRoute(product.id))
        );
      });
  }

  private loadAllProductsInSale() {
    this.productService
      .getAllProductsInSale(this.paginationState)
      .subscribe((products) => {
        this.cardInputList = products.map((product) =>
          this.mapToModel(product, this.getTargetRoute(product.id))
        );
      });
  }

  private getTargetRoute(id: number) {
    return `//${this.routeType}//${id}`;
  }
}
