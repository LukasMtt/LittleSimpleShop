import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CardBoardComponent } from './shared/card-board/card.board.component';
import { FooterComponent } from "./shared/footer/footer.component";
import { CarouselComponent } from "./shared/carousel/carousel.component";
import { RegisterModalComponent } from "./shared/register-modal/register.modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CardBoardComponent, FooterComponent, CarouselComponent, RegisterModalComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  showRegisterModal = false;

  setShowRegisterModal() {
    this.showRegisterModal = true;
  }

  setCloseRegisterModal() {
    this.showRegisterModal = false;
  }

  getHideClassForModalState() {
    if (this.showRegisterModal)
      return 'blurry-background-on-open-register-modal';
    return '';
  }
}
