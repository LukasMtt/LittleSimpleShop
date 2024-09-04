import { Component } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";

@Component({
  selector: 'app-product-board',
  standalone: true,
  imports: [CardBoardComponent],
  templateUrl: './product-board.component.html',
  styleUrl: './product-board.component.css'
})
export class ProductBoardComponent {

}
