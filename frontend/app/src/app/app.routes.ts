import { Routes } from '@angular/router';
import { ProductBoardComponent } from './ui/product/product-board/product-board.component';
import { CategoryBoardComponent } from './ui/category-board/category-board.component';
import { ProductShowComponent } from './ui/product/product-show/product-show.component';
import { HelpMeComponent } from './ui/help-me/help-me.component';
import { AccountComponent } from './ui/account/account.component';
import { AboutComponent } from './ui/about/about.component';
import { ImprintComponent } from './ui/imprint/imprint.component';
import { CartShowComponent } from './ui/cart/cart-show/cart-show.component';

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