import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-tick-counter',
    imports: [MatIconModule],
    templateUrl: './tick-counter.component.html',
    styleUrl: './tick-counter.component.css'
})
export class TickCounterComponent {
  @Input({ required: true }) counter!: number;
  @Output() counterChange = new EventEmitter<number>();

  tickCounter(amount: number): void {
    this.counter += amount;
    if (this.counter < 0) {
      this.counter = 0;
    }
    this.counterChange.emit(this.counter);
  }
}
