import { Component, Input } from '@angular/core' 
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-carousel-card-container',
    templateUrl: './carousel.card.container.component.html',
    styleUrl: './carousel.card.container.component.css',
    standalone: true,
    imports: [CardComponent]
})
export class CarouselCardContainerComponent {
    @Input({required: true}) index!: number;
    @Input({required: true}) isActive!: boolean;

    cardImagePath(n: number) {
        return `assets\\grid_image_${n}.jpg`
    }

    logMe() {
        console.log(this.isActive)
    }
}