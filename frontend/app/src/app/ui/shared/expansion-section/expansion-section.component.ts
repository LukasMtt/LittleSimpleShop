import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expansion-section',
  imports: [MatIconModule],
  templateUrl: './expansion-section.component.html',
  styleUrl: './expansion-section.component.css'
})
export class ExpansionSectionComponent {
  headerText = input.required<string>();

  expansionSectionOpen = signal<boolean>(false);

  public toggleExpansionSection() {
    this.expansionSectionOpen.update((value) => !value);
  }
}
