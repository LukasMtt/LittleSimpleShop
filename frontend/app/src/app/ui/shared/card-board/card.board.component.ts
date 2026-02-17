import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { CurrencyPipe } from '@angular/common';
import { CardInput } from '../../../models/component/card.input';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
    selector: 'app-card-board',
    templateUrl: './card.board.component.html',
    styleUrl: './card.board.component.css',
    host: {
        '[class.grid-design-3-col]': 'columnCount == 3',
        '[class.grid-design-4-col]': 'columnCount == 4'
    },
    imports: [RouterLink, CardComponent, CurrencyPipe, TooltipComponent]
})
export class CardBoardComponent {
  @Input({ required: true }) cardInputList!: CardInput[];
  @Input({ required: true }) columnCount!: 3 | 4;
  @Input() useLargeText: boolean = false;
}
