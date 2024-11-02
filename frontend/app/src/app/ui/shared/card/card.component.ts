import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CardViewable } from '../../../models/card.viewable.model';
import { NgStyle} from '@angular/common'

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent extends NgStyle {
  @Input() routerLink: string = ''
  @Input({required: true}) model!: CardViewable
  
  createImage() {
    return 'data:image/webp;base64,' + this.model.images[0].bytes;
  }
}
