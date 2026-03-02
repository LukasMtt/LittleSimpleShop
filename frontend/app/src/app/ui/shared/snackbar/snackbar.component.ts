import { Component, effect, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snackbar',
  imports: [MatIconModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  textSnackbar = input.required<string>();
  triggerSnackbar = input.required<boolean | undefined>();
  showSnackbar = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.triggerSnackbar() !== undefined) {
        this.showSnackbar.set(true);
        setTimeout(() => {
          this.showSnackbar.set(false);
        }, 4000);
      }
    });
  }
}
