import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CardViewable } from '../../models/card-viewable.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() routerLink: string = ''
  @Input({required: true}) model!: CardViewable
  
  cardImagePath(n: number) {
    return `assets\\grid_image_${n}.jpg`
  }
}
