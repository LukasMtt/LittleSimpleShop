import { Component, computed, effect, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FileFetchService } from '../../../services/file.fetch.service';
import { DisplayImageInput } from '../../../models/component/display-image.input';

@Component({
  selector: 'app-carousel',
  imports: [MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  imagesInput = input.required<DisplayImageInput[] | undefined>();

  currentIndex = signal<number>(0);
  filledImages = signal<DisplayImageInput[]>([]);
  toggledImage = signal<boolean>(false);
  selectedImage = computed<DisplayImageInput | undefined>(() => {
    let images = this.filledImages();
    if (images) {
      return images[this.currentIndex()];
    } else {
      return undefined;
    }
  });

  constructor(private fileFetchService: FileFetchService) {
    effect(() => {
      if (this.imagesInput()) {
        this.setImagesDataUrl();
      }
    });
  }

  public nextImage(isBack: boolean) {
    const imagesCount = this.filledImages()?.length ?? 0;
    if (isBack) {
      this.currentIndex.update(
        (value) => (value + imagesCount - 1) % imagesCount
      );
    } else {
      this.currentIndex.update((value) => (value + 1) % imagesCount);
    }
    this.toggledImage.update((value) => !value);
  }

  public setImagesDataUrl() {
    if (!this.imagesInput() || this.imagesInput()?.length === 0) {
      return;
    }
    this.imagesInput()!.forEach((image) => {
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
        this.filledImages.update((value) => [...value, image]);
      });
    });
  }
}
