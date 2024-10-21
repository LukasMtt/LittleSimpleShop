import { Component } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";
import { ProductService } from '../services/product.service';
import { RouteEndpointType } from '../app.routes';
import { ProductCategory } from '../models/product.category.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-board',
  standalone: true,
  imports: [CardBoardComponent],
  templateUrl: './category-board.component.html'
})
export class CategoryBoardComponent {
  routeType  = RouteEndpointType.Products.toString()  
  categoryList: ProductCategory[] = []

  constructor(public productService: ProductService, private httpClient: HttpClient) {
    productService.getAllCategories().subscribe((data) => 
    { 
      httpClient.get("assets/test.webp", { responseType: 'blob'}).subscribe((imageBlob) => {
        let reader = new FileReader();
        reader.addEventListener("load",
          () => {
            this.categoryList = data.concat(this.getAdditionalArtificialCategories(reader.result as string));
          }
        );
        reader.readAsDataURL(imageBlob);
      });
    });
  }

  getAdditionalArtificialCategories(imageStr: string): ProductCategory[] {
    imageStr = imageStr.replace('data:image/webp;base64,', '');
    return [
      { id: 0,  
        name: "All", 
        images: [ { bytes: imageStr, description: "", fileExtension: "webp", size: 0 } ], 
        gridRowStartEnd:["1", "3"] 
      }
    ]
  }


}
