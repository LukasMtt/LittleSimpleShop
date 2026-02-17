import { Component, Input, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FileFetchService } from '../../../services/file.fetch.service';
import { DisplayImageInput } from '../../../models/component/display-image.input';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnChanges {
  @Input({ required: true }) get images(): DisplayImageInput[] | undefined {
    return this._images;
  }
  set images(newValue: DisplayImageInput[] | undefined) {
    this._images = newValue;
    this.setImagesDataUrl();
  }

  selectedImage?: DisplayImageInput;
  currentIndex: number = 0;

  private _images: DisplayImageInput[] | undefined;

  constructor(private fileFetchService: FileFetchService) {}

  ngOnChanges() {
    if (this.images) {
      this.selectedImage = this.images[this.currentIndex];
    }
  }

  nextImage(isBack: boolean) {
    const imagesCount = this.images?.length ?? 0;
    if (isBack) {
      this.currentIndex = (this.currentIndex + imagesCount - 1) % imagesCount;
    } else {
      this.currentIndex = (this.currentIndex + 1) % imagesCount;
    }
  }

  public setImagesDataUrl() {
    if (!this.images || this.images?.length === 0) {
      return;
    }
    this.images.forEach((image) => {
      let httpResponse = this.fileFetchService.getPublicImageResponseBlob(
        image.id || 0,
        image.fileId || ''
      );
      httpResponse.subscribe((response) => {
        this.fileFetchService.readFileAsDataUrl(
          response.body as Blob,
          response.headers.get('Content-Type') ?? '',
          image.fileContent!
        );
      });
    });
  }
}
