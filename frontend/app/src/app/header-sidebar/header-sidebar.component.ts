import { Component } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-header-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent extends BaseComponent {
  constructor(resourceService: ResourceService) {
    super(resourceService)
  }
}
