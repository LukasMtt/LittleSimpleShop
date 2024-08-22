import { Component } from '@angular/core' 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderSidebarComponent } from "../header-sidebar/header-sidebar.component";
import { ResourceService } from '../services/resource.service';
import { BaseComponent } from '../shared/base.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, HeaderSidebarComponent]
})
export class HeaderComponent extends BaseComponent {
    showSideMenu: boolean = false;

    constructor(resourceService: ResourceService) {
        super(resourceService)
    }
    
    onMenuButtonClick() {
        this.showSideMenu = !this.showSideMenu;
    }
}