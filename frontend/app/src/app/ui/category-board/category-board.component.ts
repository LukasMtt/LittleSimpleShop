import { Component, OnInit } from '@angular/core';
import { CardBoardComponent } from '../shared/card-board/card.board.component';
import { RouteEndpointType } from '../../app.routes';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { TemplateTypeCardBoardSubText } from '../../enums/template-type-card-board-sub-text.enum';
import { CategoryType } from '../../enums/category-type.enum';
import { BaseComponent } from '../shared/base.component';
import {
  EndpointItem,
  EndpointResolveService
} from '../../services/endpoint.resolve.service';
import { CategoryDTO } from '../../models/api/category.dto';
import { CardInput } from '../../models/component/card.input';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-board',
  templateUrl: './category-board.component.html',
  styleUrl: './category-board.component.css',
  imports: [CardBoardComponent]
})
export class CategoryBoardComponent extends BaseComponent implements OnInit {
  cardInputList: CardInput[] = [];
  routeType = RouteEndpointType.Products.toString();
  templateTypeEnum = TemplateTypeCardBoardSubText;

  constructor(
    private categoryService: CategoryService,
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {
    super();
  }

  ngOnInit(): void {
    let additionalImageObservable$: Observable<CategoryDTO | undefined>[] = [
      this.httpClient.get<CategoryDTO | undefined>(
        this.endpointResolveService.buildUrl(EndpointItem.GetSaleCategory, [])
      ),
      this.httpClient.get<CategoryDTO | undefined>(
        this.endpointResolveService.buildUrl(EndpointItem.GetAllCategory, [])
      )
    ];

    this.categoryService.getAllCustomCategories().subscribe((data) => {
      forkJoin(additionalImageObservable$).subscribe(
        ([saleCategory, allCategory]) => {
          this.cardInputList = data.map((category) =>
            this.mapToModel(
              category,
              category.name,
              this.getTargetRoute(category.id, CategoryType.Default)
            )
          );

          let additionalSyntheticCategories = [];
          if (saleCategory) {
            additionalSyntheticCategories.push(
              this.mapToModel(
                saleCategory,
                this.res(`CATEGORY_TYPE_${CategoryType.Sale.toUpperCase()}`),
                this.getTargetRoute(0, CategoryType.Sale),
                ['3', '4']
              )
            );
          }
          if (allCategory) {
            additionalSyntheticCategories.push(
              this.mapToModel(
                allCategory,
                this.res(`CATEGORY_TYPE_${CategoryType.All.toUpperCase()}`),
                this.getTargetRoute(0, CategoryType.All),
                ['1', '3']
              )
            );
          }

          this.cardInputList = this.cardInputList.concat(
            additionalSyntheticCategories
          );
        }
      );
    });
  }

  private mapToModel(
    category: CategoryDTO,
    name?: string,
    targetRoute?: string,
    gridRowStartEnd?: [string, string]
  ): CardInput {
    return {
      image: {
        id: category.images[0].id,
        fileId: category.images[0].fileId,
        categoryId: category.id
      },
      subText: name ?? '',
      gridRowStartEnd: gridRowStartEnd,
      cardLink: targetRoute
    };
  }

  private getTargetRoute(id: number, categoryType: CategoryType) {
    return `//${this.routeType}//${id}//${categoryType}`;
  }
}
