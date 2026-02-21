import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tick-counter',
  imports: [MatIconModule],
  templateUrl: './tick-counter.component.html',
  styleUrl: './tick-counter.component.css',
  host: {
    '[style.flex-direction]': 'counterDirection()'
  }
})
export class TickCounterComponent {
  @Input({ required: true }) counter!: number;
  counterDirection = input<'row' | 'column'>('row');
  minCounter = input<number>(0);

  @Output() counterChange = new EventEmitter<number>();

  tickCounter(amount: number): void {
    this.counter += amount;
    if (this.counter < this.minCounter()) {
      this.counter = this.minCounter();
    }
    this.counterChange.emit(this.counter);
  }
}
