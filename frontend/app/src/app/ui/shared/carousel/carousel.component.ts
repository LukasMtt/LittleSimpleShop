import { Component, computed, effect, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DisplayImageInput } from '../../../models/component/display-image.input';
import {
  EndpointItem,
  EndpointResolveService
} from '../../../services/endpoint.resolve.service';

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
  enlargedCarouselImage = signal<boolean>(false);
  selectedImage = computed<DisplayImageInput | undefined>(() => {
    let images = this.filledImages();
    if (images) {
      return images[this.currentIndex()];
    } else {
      return undefined;
    }
  });

  constructor(private endpointResolveService: EndpointResolveService) {
    effect(() => {
      if (this.imagesInput()) {
        this.filledImages.set([]);
        let images: DisplayImageInput[] = [];
        this.imagesInput()!.forEach((image) => {
          image.imgSrc = this.endpointResolveService.buildUrl(
            EndpointItem.GetPublicImage,
            [
              { key: 'imageId', value: `${image?.id ?? 0}` },
              { key: 'fileId', value: `${image?.fileId ?? ''}` }
            ]
          );
          images.push(image);
        });
        this.filledImages.set(images);
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

  public openPopUpCarouselImage() {
    this.enlargedCarouselImage.set(true);
  }

  public closePopUpCarouselImage() {
    this.enlargedCarouselImage.set(false);
  }
}
