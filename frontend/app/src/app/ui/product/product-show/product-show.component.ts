import { Component, Input, OnInit } from '@angular/core';
import { ProductDTO } from '../../../models/api/product.dto';
import { ProductService } from '../../../services/product.service';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { FileFetchService } from '../../../services/file.fetch.service';
import { DisplayImageInput } from '../../../models/component/display-image.input';

@Component({
  selector: 'app-product-show',
  imports: [CarouselComponent, CurrencyPipe],
  templateUrl: './product-show.component.html',
  styleUrl: './product-show.component.css'
})
export class ProductShowComponent implements OnInit {
  @Input({ required: true }) productId!: number;

  //todo rotate DTO out in favor of the input
  product: ProductDTO | undefined;
  mainImage: DisplayImageInput | undefined;
  carouselImages: DisplayImageInput[] = [];
  midDotString: string = '\u00B7';

  private carouselImageLength = 3;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private fileFetchService: FileFetchService
  ) {}

  ngOnInit(): void {
    this.productService
      .getProductById(this.productId ?? 0)
      .subscribe((data) => {
        this.product = data;
        this.setImageDataUrl();
        //todo somehow not working yet
        this.carouselImages =
          this.product?.images
            .slice(0, this.carouselImageLength)
            .map((imageSpec) => {
              return {
                id: imageSpec.id,
                fileId: imageSpec.fileId,
                productId: imageSpec.productId,
                fileContent: { dataUrl: '' }
              };
            }) ?? [];
      });
  }

  getPrice(product: ProductDTO | undefined) {
    if (product) {
      return product.price;
    }
    return '';
  }

  addProductToCart() {
    if (this.product)
      this.cartService.pushCartItem({
        product: this.product,
        count: 1
      });
    else console.log('Adding product to cart failed. No product accessible.');
  }

  public setImageDataUrl() {
    if (!this.product?.images || this.product?.images?.length === 0) {
      return;
    }
    this.mainImage = {
      id: this.product.images[0].id,
      fileId: this.product.images[0].fileId,
      productId: this.product.images[0].productId,
      fileContent: { dataUrl: '' }
    };
    let httpResponse = this.fileFetchService.getPublicImageResponseBlob(
      this.mainImage.id,
      this.mainImage.fileId || ''
    );
    httpResponse.subscribe((response) => {
      this.fileFetchService.readFileAsDataUrl(
        response.body as Blob,
        response.headers.get('Content-Type') ?? '',
        this.mainImage!.fileContent!
      );
    });
  }
}
