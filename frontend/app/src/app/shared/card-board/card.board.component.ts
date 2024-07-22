import { Component } from '@angular/core'
import { CardComponent } from '../card/card.component'

@Component({
    selector: 'app-card-board',
    templateUrl: './card.board.component.html',
    styleUrl: './card.board.component.css',
    standalone: true,
    imports: [CardComponent]
})
export class CardBoardComponent {
    cardImagePath(n: number) {
        return `assets\\grid_image_${n}.jpg`
    }
}