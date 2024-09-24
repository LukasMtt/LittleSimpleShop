import { Component, Input, OnChanges } from '@angular/core';
import { Image } from '../models/image.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnChanges {
  @Input({required: true}) images!: Image[];
  
  selectedImage?: Image;
  currentIndex: number = 0;

  ngOnChanges() {
    if(this.images)
      this.selectedImage = this.images[this.currentIndex];
  }

  nextImage(isBack: boolean) {
    var imagesCount = this.images?.length ?? 0;
    if (isBack)
      this.currentIndex = (this.currentIndex + imagesCount - 1) % imagesCount;
    else
      this.currentIndex = (this.currentIndex + 1) % imagesCount;
  }

  createImage(image?: Image) {
    if (image) {
      return 'data:image/webp;base64,' + image.bytes;
    }
    return '';
  }
}
