import { Component, ElementRef, HostListener } from '@angular/core' 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderSidebarComponent } from "../header-sidebar/header-sidebar.component";
import { BaseComponent } from '../shared/base.component';
import { CartSidebarComponent } from "../cart-sidebar/cart-sidebar.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, HeaderSidebarComponent, CartSidebarComponent, RouterLink]
})
export class HeaderComponent extends BaseComponent {
    showSideMenu: boolean = false;
    showCartMenu: boolean = false;

    constructor(private elementRef: ElementRef) {
        super();
    }

    @HostListener('document:click', ['$event.target'])
    public onArbitraryClick(targetElement: any) {
        const isClickInsideHeaderElement = this.elementRef.nativeElement.contains(targetElement);
        if (!isClickInsideHeaderElement) {
	        this.showSideMenu = false;
            this.showCartMenu = false;
        }
    }
    
    onMenuButtonClick() {
        this.showSideMenu = !this.showSideMenu;
    }

    onCartButtonClick() {
        this.showCartMenu = !this.showCartMenu;
    }
}