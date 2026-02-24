import { Component, effect, ElementRef, model, Renderer2 } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { SidebarItemComponent } from '../../shared/sidebar-item/sidebar-item.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-sidebar',
  imports: [SidebarComponent, SidebarItemComponent, RouterLink],
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent extends BaseComponent {
  isHidden = model.required<boolean>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    super();
    effect(() => {
      if (this.isHidden() !== undefined) {
        this.setSidebarPositionOnChange();
      }
    });
  }

  private setSidebarPositionOnChange() {
    if (this.isHidden()) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', '-50%');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', '0%');
    }
  }
}
