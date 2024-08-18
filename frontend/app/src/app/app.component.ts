import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CardBoardComponent } from './card-board/card.board.component';
import { FooterComponent } from "./shared/footer/footer.component";
import { RegisterModalComponent } from "./shared/register-modal/register.modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CardBoardComponent, FooterComponent, RegisterModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}
