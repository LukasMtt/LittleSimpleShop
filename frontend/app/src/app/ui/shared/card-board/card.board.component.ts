import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { CardViewable } from '../../../models/card.viewable.model';
import { TemplateTypeCardBoardSubText } from '../../../enums/template-type-card-board-sub-text.enum';
import { Product } from '../../../models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-board',
  templateUrl: './card.board.component.html',
  styleUrl: './card.board.component.css',
  standalone: true,
  imports: [RouterLink, CardComponent, CurrencyPipe]
})
export class CardBoardComponent implements OnInit {
  @Input({ required: true }) columnCount!: 3 | 4;
  @Input({ required: true }) cardItemList!: CardViewable[];
  @Input({ required: true }) templateType!: TemplateTypeCardBoardSubText;

  templateTypeEnum = TemplateTypeCardBoardSubText;

  @HostBinding('className') gridDesignCols: any;

  ngOnInit(): void {
    this.gridDesignCols = `grid-design-${this.columnCount}-col`;
  }

  getPrice(cardViewable: CardViewable) {
    var product = cardViewable as Product;
    if (product) {
      return product.price;
    }
    return '';
  }

  getStyleForGridExtension(cardViewable: CardViewable) {
    if (cardViewable.gridRowStartEnd) {
      return {
        'grid-row-start': `${cardViewable.gridRowStartEnd[0]}`,
        'grid-row-end': `${cardViewable.gridRowStartEnd[1]}`
      };
    }
    return {};
  }
}
