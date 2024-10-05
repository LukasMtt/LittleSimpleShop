import { Component, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { ResourceService } from '../services/resource.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { SidebarItemComponent } from "../shared/sidebar-item/sidebar-item.component";
import { SidebarSpacerComponent } from "../shared/sidebar-spacer/sidebar-spacer.component";
import { SidebarPosition } from '../enums/sidebar-position.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-sidebar',
  standalone: true,
  imports: [SidebarComponent, SidebarItemComponent, SidebarSpacerComponent, RouterLink],
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent extends BaseComponent {
  readonly sidebarPosition: SidebarPosition = SidebarPosition.Left
  
  constructor() {
    super();
  }
}
