import { Routes } from '@angular/router';
import { ProductBoardComponent } from './product-board/product-board.component';
import { CategoryBoardComponent } from './category-board/category-board.component';
import { ProductShowComponent } from './product-show/product-show.component';

export const routes: Routes = [
    { path: '', component: CategoryBoardComponent },
    { path: 'products/:categoryId', component: ProductBoardComponent },
    { path: 'showProduct/:productId', component: ProductShowComponent}
];

export enum RouteEndpointType {
    Products = "products",
    ShowProduct = "showProduct"
}