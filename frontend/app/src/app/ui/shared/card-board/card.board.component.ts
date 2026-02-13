import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { TemplateTypeCardBoardSubText } from '../../../enums/template-type-card-board-sub-text.enum';
import { CurrencyPipe } from '@angular/common';
import { CardInput } from '../../../models/component/card.input';
import { ProductCardInput } from '../../../models/component/product-card.input';

@Component({
  selector: 'app-card-board',
  templateUrl: './card.board.component.html',
  styleUrl: './card.board.component.css',
  standalone: true,
  imports: [RouterLink, CardComponent, CurrencyPipe]
})
export class CardBoardComponent implements OnInit {
  @Input({ required: true }) columnCount!: 3 | 4;
  @Input({ required: true }) cardModelList!: CardInput[];
  @Input({ required: true }) templateType!: TemplateTypeCardBoardSubText;

  templateTypeEnum = TemplateTypeCardBoardSubText;

  @HostBinding('className') gridDesignCols: any;

  public ngOnInit(): void {
    this.gridDesignCols = `grid-design-${this.columnCount}-col`;
  }

  public getPrice(cardModel: CardInput) {
    var product = cardModel as ProductCardInput;
    if (product) {
      return product.price;
    }
    return '';
  }

  public getStyleForGridExtension(
    cardModel: CardInput
  ): Record<string, string> {
    if (cardModel.gridRowStartEnd) {
      return {
        'grid-row-start': `${cardModel.gridRowStartEnd[0]}`,
        'grid-row-end': `${cardModel.gridRowStartEnd[1]}`
      };
    }
    return {};
  }
}
