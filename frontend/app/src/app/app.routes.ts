import { Routes } from '@angular/router';
import { ProductBoardComponent } from './product-board/product-board.component';
import { CategoryBoardComponent } from './category-board/category-board.component';
import { ProductShowComponent } from './product-show/product-show.component';
import { HelpMeComponent } from './help-me/help-me.component';
import { AccountComponent } from './account/account.component';
import { AboutComponent } from './about/about.component';
import { ImprintComponent } from './imprint/imprint.component';
import { CartShowComponent } from './cart-show/cart-show.component';

export const routes: Routes = [
    { path: '', component: CategoryBoardComponent },
    { path: 'shop', redirectTo: '' },
    { path: 'help', component: HelpMeComponent },
    { path: 'account', component: AccountComponent },
    { path: 'about', component: AboutComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'cart', component: CartShowComponent},

    { path: 'products/:categoryId', component: ProductBoardComponent },
    { path: 'showProduct/:productId', component: ProductShowComponent}
];

export enum RouteEndpointType {
    Products = "products",
    ShowProduct = "showProduct"
}