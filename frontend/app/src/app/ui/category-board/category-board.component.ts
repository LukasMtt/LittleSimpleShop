import { Component } from '@angular/core';
import { CardBoardComponent } from '../shared/card-board/card.board.component';
import { ProductService } from '../../services/product.service';
import { RouteEndpointType } from '../../app.routes';
import { ProductCategory } from '../../models/product.category.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { TemplateTypeCardBoardSubText } from '../../enums/template-type-card-board-sub-text.enum';
import { CategoryType } from '../../enums/category-type.enum';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-category-board',
  templateUrl: './category-board.component.html',
  styleUrl: './category-board.component.css',
  standalone: true,
  imports: [CardBoardComponent]
})
export class CategoryBoardComponent extends BaseComponent {
  routeType = RouteEndpointType.Products.toString();
  categoryList: ProductCategory[] = [];

  templateTypeEnum = TemplateTypeCardBoardSubText;

  additionalImageObservable$: Observable<any>[] = [
    this.httpClient.get('assets/images/test.webp', { responseType: 'blob' }),
    this.httpClient.get('assets/images/test2.webp', { responseType: 'blob' })
  ];

  constructor(
    public productService: ProductService,
    private httpClient: HttpClient
  ) {
    super();
    productService.getAllCategories().subscribe((data) => {
      forkJoin(this.additionalImageObservable$).subscribe(([img1, img2]) => {
        data.forEach(
          (value) =>
            (value.cardLink = this.getTargetRoute(
              value.id,
              CategoryType.Default
            ))
        );
        this.categoryList = data;

        this.extendCategoryListBySyntheticCategories(
          this.res(`CATEGORY_TYPE_${CategoryType.All.toUpperCase()}`),
          img1,
          this.getAllCategory,
          this.getTargetRoute(0, CategoryType.All)
        );
        this.extendCategoryListBySyntheticCategories(
          this.res(`CATEGORY_TYPE_${CategoryType.Sale.toUpperCase()}`),
          img2,
          this.getSaleCategory,
          this.getTargetRoute(0, CategoryType.Sale)
        );
      });
    });
  }

  private getAllCategory(
    name: string,
    imageStr: string,
    targetRoute: string
  ): ProductCategory {
    imageStr = imageStr.replace('data:image/webp;base64,', '');
    return {
      id: 0,
      name: name,
      images: [
        { bytes: imageStr, description: '', fileExtension: 'webp', size: 0 }
      ],
      gridRowStartEnd: ['1', '3'],
      cardLink: targetRoute
    };
  }

  private getSaleCategory(
    name: string,
    imageStr: string,
    targetRoute: string
  ): ProductCategory {
    imageStr = imageStr.replace('data:image/webp;base64,', '');
    return {
      id: 0,
      name: name,
      images: [
        { bytes: imageStr, description: '', fileExtension: 'webp', size: 0 }
      ],
      gridRowStartEnd: ['3', '4'],
      cardLink: targetRoute
    };
  }

  private extendCategoryListBySyntheticCategories(
    name: string,
    img: Blob,
    categoryProducerFunction: CategoryProducerFunction,
    targetRoute: string
  ) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.categoryList.push(
        categoryProducerFunction(name, reader.result as string, targetRoute)
      );
    });
    reader.readAsDataURL(img);
  }

  private getTargetRoute(id: number, categoryType: CategoryType) {
    return `//${this.routeType}//${id}//${categoryType}`;
  }
}

type CategoryProducerFunction = (
  name: string,
  imgStr: string,
  targetRoute: string
) => ProductCategory;
