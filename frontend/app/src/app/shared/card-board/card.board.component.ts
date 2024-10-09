import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core'
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CardComponent } from "../card/card.component";
import { CardViewable } from '../../models/card.viewable.model';

@Component({
    selector: 'app-card-board',
    templateUrl: './card.board.component.html',
    styleUrl: './card.board.component.css',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, RouterLink, RouterLinkActive, CardComponent, RouterOutlet]
})
export class CardBoardComponent implements OnInit {
    @Input() cardCount?: number;
    @Input({required: true}) columnCount!: 3|4;
    @Input() routerLink: string = ''
    @Input({required: true}) dataStore: CardViewable[] = []

    @HostBinding('className') gridDesignCols: any;

    ngOnInit(): void {
        this.gridDesignCols = `grid-design-${this.columnCount}-col`;
    }

    getCardCountList() {
        return [...Array(this.cardCount ?? 0).keys()];
    }

    getFullRoute(categoryId: number) {
        return `${this.routerLink}//${categoryId}`
    }
}