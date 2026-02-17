import { Component } from '@angular/core';
import { CategoryBoardComponent } from "../category-board/category-board.component";
import { NewsletterSubscribeComponent } from "../newsletter-subscribe/newsletter-subscribe.component";

@Component({
    selector: 'app-landing-page',
    imports: [CategoryBoardComponent, NewsletterSubscribeComponent],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
}
