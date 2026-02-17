import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-button',
    imports: [MatIcon],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css'
})
export class ButtonComponent implements OnInit {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() matIcon: string = '';
  @Input() border: 'solid' | 'none' = 'none';
  @Input() hideLabelOnMobile: boolean = false;

  public labelClass: string = 'button-label';

  public ngOnInit() {
    if (this.hideLabelOnMobile) {
      this.labelClass += ' hide-label-on-mobile';
    }
  }
}
