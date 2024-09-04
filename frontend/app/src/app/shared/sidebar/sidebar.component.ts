import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SidebarPosition } from '../../enums/sidebar-position.enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input({required: true}) sidebarPosition!: SidebarPosition
  sidebarPositionType = SidebarPosition;
}
