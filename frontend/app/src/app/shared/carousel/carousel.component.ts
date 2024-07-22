import { Component } from '@angular/core' 
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css',
    standalone: true,
    imports: [CardComponent]
})
export class CarouselComponent {
    cardImagePath(n: number) {
        return `assets\\grid_image_${n}.jpg`
    }
}