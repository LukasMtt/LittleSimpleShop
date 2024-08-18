import { Component } from '@angular/core' 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderSidebarComponent } from "../header-sidebar/header-sidebar.component";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, HeaderSidebarComponent]
})
export class HeaderComponent {
    showSideMenu: boolean = false;

    onMenuButtonClick() {
        this.showSideMenu = !this.showSideMenu;
    }
}