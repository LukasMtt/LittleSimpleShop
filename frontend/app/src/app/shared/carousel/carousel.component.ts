import { Component, Input } from '@angular/core'
import { PaginationComponent } from "../pagination/pagination.component";
import { CarouselCardContainerComponent } from '../caoursel-card-container/carousel.card.container.component';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css',
    standalone: true,
    imports: [PaginationComponent, CarouselCardContainerComponent]
})
export class CarouselComponent {
    @Input({required: true}) slideCount!: number;
    currentSlideIndex: number = 0

    changeCard(isForward: boolean) {
        if (isForward)
            this.currentSlideIndex = (this.currentSlideIndex+1)%this.slideCount
        else 
            this.currentSlideIndex = (this.currentSlideIndex+this.slideCount-1)%this.slideCount
        console.log(this.currentSlideIndex)
    }

    isActive(index: number) {
        return index == this.currentSlideIndex
    }
}