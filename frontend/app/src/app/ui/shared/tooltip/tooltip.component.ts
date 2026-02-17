import { Component, Input, signal } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    imports: [],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.css',
    host: { '(mouseover)': 'showTooltip()', '(mouseleave)': 'hideTooltip()' }
})
export class TooltipComponent {
  @Input({ required: true }) tooltipText: string = '';

  public tooltipVisible = signal(false);

  public showTooltip() {
    this.tooltipVisible.set(true);
  }

  public hideTooltip() {
    this.tooltipVisible.set(false);
  }
}
