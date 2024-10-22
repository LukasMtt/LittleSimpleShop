import { Component } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";
import { ProductService } from '../services/product.service';
import { RouteEndpointType } from '../app.routes';
import { ProductCategory } from '../models/product.category.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-category-board',
  standalone: true,
  imports: [CardBoardComponent],
  templateUrl: './category-board.component.html'
})
export class CategoryBoardComponent {
  routeType  = RouteEndpointType.Products.toString()  
  categoryList: ProductCategory[] = []

  additionalImageObservable$: Observable<any>[] = [
    this.httpClient.get("assets/test.webp", { responseType: 'blob'}),
    this.httpClient.get("assets/test2.webp", { responseType: 'blob'})
  ]

  constructor(public productService: ProductService, private httpClient: HttpClient) {
    productService.getAllCategories().subscribe((data) => 
    { 
      forkJoin(this.additionalImageObservable$).subscribe(([img1, img2]) => {
        this.categoryList = data;

        this.extendCategoryListBySyntheticCategories(img1, this.getAllCategory);
        this.extendCategoryListBySyntheticCategories(img2, this.getSaleCategory);
      });
    });
  }

  private getAllCategory(imageStr: string): ProductCategory {
    imageStr = imageStr.replace('data:image/webp;base64,', '');
    return { 
        id: 0,  
        name: "All", 
        images: [ { bytes: imageStr, description: "", fileExtension: "webp", size: 0 } ], 
        gridRowStartEnd: ["1", "3"] 
      }
  }

  private getSaleCategory(imageStr: string): ProductCategory {
    imageStr = imageStr.replace('data:image/webp;base64,', '');
    return { 
        id: 0,  
        name: "Sale", 
        images: [ { bytes: imageStr, description: "", fileExtension: "webp", size: 0 } ], 
        gridRowStartEnd: ["3", "4"] 
      }
  }

  private extendCategoryListBySyntheticCategories(img: Blob, categoryProducerFunction: CategoryProducerFunction) {
    let reader = new FileReader();
    reader.addEventListener("load",
      () => {
        this.categoryList.push(categoryProducerFunction(reader.result as string));
      }
    );
    reader.readAsDataURL(img);
  }
}

type CategoryProducerFunction = (imgStr: string) => ProductCategory;