import { Component } from '@angular/core';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { BaseComponent } from '../shared/base.component';
import { ResourceService } from '../services/resource.service';
import { SidebarItemComponent } from "../shared/sidebar-item/sidebar-item.component";
import { SidebarSpacerComponent } from "../shared/sidebar-spacer/sidebar-spacer.component";
import { SidebarPosition } from '../enums/sidebar-position.enum';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [SidebarComponent, SidebarItemComponent, SidebarSpacerComponent],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent extends BaseComponent {
  readonly sidebarPosition: SidebarPosition = SidebarPosition.Right

  constructor(resourceService: ResourceService) {
    super(resourceService)
  }
}
