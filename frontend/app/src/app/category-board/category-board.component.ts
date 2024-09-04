import { Component } from '@angular/core';
import { CardBoardComponent } from "../shared/card-board/card.board.component";

@Component({
  selector: 'app-category-board',
  standalone: true,
  imports: [CardBoardComponent],
  templateUrl: './category-board.component.html',
  styleUrl: './category-board.component.css'
})
export class CategoryBoardComponent {

}
