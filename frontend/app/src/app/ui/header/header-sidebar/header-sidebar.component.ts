import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { SidebarItemComponent } from "../../shared/sidebar-item/sidebar-item.component";
import { SidebarSpacerComponent } from "../../shared/sidebar-spacer/sidebar-spacer.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-sidebar',
  standalone: true,
  imports: [SidebarComponent, SidebarItemComponent, SidebarSpacerComponent, RouterLink],
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent extends BaseComponent implements OnChanges {
  @Input({required: true}) isHidden!: boolean
  
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnChanges(): void {
    this.setSidebarPositionOnChange();
  }

  private setSidebarPositionOnChange() {
    if(this.isHidden) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', '-50%');
    }
    else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', '0%');
    }
  }
}
