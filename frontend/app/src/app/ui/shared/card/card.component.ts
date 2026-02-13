import { Component, Input } from '@angular/core';
import { FileFetchService } from '../../../services/file.fetch.service';
import { CardInput } from '../../../models/component/card.input';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({ required: true }) get cardModel(): CardInput | undefined {
    return this._cardModel;
  }
  set cardModel(newValue: CardInput | undefined) {
    this._cardModel = newValue;
    this.setImageDataUrl();
  }
  @Input() routerLink: string = '';

  private _cardModel: CardInput | undefined;

  constructor(private fileFetchService: FileFetchService) {}

  public setImageDataUrl() {
    if (!this.cardModel?.image) {
      return;
    }
    let httpResponse = this.fileFetchService.getPublicImageResponseBlob(
      this.cardModel?.image?.id ?? 0,
      this.cardModel?.image?.fileId ?? ''
    );
    httpResponse.subscribe((response) => {
      this.cardModel!.image!.fileContent = { dataUrl: '' };
      this.fileFetchService.readFileAsDataUrl(
        response.body as Blob,
        response.headers.get('Content-Type') ?? '',
        this.cardModel!.image!.fileContent!
      );
    });
  }
}
