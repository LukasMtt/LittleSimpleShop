import { Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { BaseComponent } from '../shared/base.component';
import { SidebarItemComponent } from "../shared/sidebar-item/sidebar-item.component";
import { SidebarSpacerComponent } from "../shared/sidebar-spacer/sidebar-spacer.component";

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [SidebarComponent, SidebarItemComponent, SidebarSpacerComponent],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent extends BaseComponent implements OnChanges {
  @Input({required: true}) isHidden!: boolean

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnChanges(): void {
    this.setSidebarPositionOnChange();
  }

  private setSidebarPositionOnChange() {
    if(this.isHidden) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '-50%');
    }
    else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', '0%');
    }
  }
}
