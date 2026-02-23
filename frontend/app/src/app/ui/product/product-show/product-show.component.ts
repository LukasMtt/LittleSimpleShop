import { Component, computed, effect, input, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { FileFetchService } from '../../../services/file.fetch.service';
import { DisplayImageInput } from '../../../models/component/display-image.input';
import { ButtonComponent } from '../../shared/button/button.component';
import { BaseComponent } from '../../shared/base.component';
import { RouterLink } from '@angular/router';
import { TickCounterComponent } from '../../shared/tick-counter/tick-counter.component';
import { TextBadgeComponent } from '../../shared/text-badge/text-badge.component';
import { ExpansionSectionComponent } from '../../shared/expansion-section/expansion-section.component';
import { ReplaceStringPipe } from '../../../pipes/replace.pipe';
import { MetadataService } from '../../../services/metadata.service';
import { ShippingService } from '../../../services/shipping.service';

@Component({
  selector: 'app-product-show',
  imports: [
    CarouselComponent,
    CurrencyPipe,
    ButtonComponent,
    RouterLink,
    TickCounterComponent,
    TextBadgeComponent,
    ExpansionSectionComponent,
    UpperCasePipe,
    ReplaceStringPipe
  ],
  templateUrl: './product-show.component.html',
  styleUrl: './product-show.component.css'
})
export class ProductShowComponent extends BaseComponent {
  productId = input.required<number>();

  productName = signal<string>('');
  productPrice = signal<number | undefined>(undefined);
  productDescription = signal<string>('');
  productDescriptionExtended = signal<string>('');
  productDescriptionExtendedHeader = signal<string>('');
  safetyUsageDescription = signal<string>('');
  safetyUsageDescriptionHeader = signal<string>('');
  productCount = signal<number>(1);
  isProductInStock = signal<boolean>(false);
  productHighlights = signal<string[]>([]);
  carouselImages = signal<DisplayImageInput[]>([]);
  subPriceMetaInfos = signal<string[]>([]);
  shippingAndReturnPolicy = signal<string>('');
  shippingAndReturnPolicyHeader = signal<string>('');
  freeShippingString = signal<string>('');
  freeShippingThresholdString = signal<string>('');
  shippingDeliveryEstimationString = signal<string | undefined>(undefined);

  subPriceMetaInfosLength = computed(() => {
    return this.subPriceMetaInfos().length;
  });
  productInStockString = computed(() => {
    if (this.isProductInStock()) {
      return this.res('PRODUCT_IN_STOCK');
    }
    return this.res('PRODUCT_NOT_IN_STOCK');
  });
  productInStockBadgeBackgroundColor = computed(() => {
    if (this.isProductInStock()) {
      return 'var(--secondary-color)';
    }
    return 'gray';
  });

  public midDotString: string = '\u00B7';
  private carouselImageMaxLength = 15;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private fileFetchService: FileFetchService,
    metaDataService: MetadataService,
    shippingService: ShippingService,
    currencyPipe: CurrencyPipe
  ) {
    super();
    this.freeShippingString.set(this.res('FREE_SHIPPING_FROM'));
    this.productDescriptionExtendedHeader.set(
      this.res('PRODUCT_DESCRIPTION_EXTENDED_HEADER')
    );
    this.shippingAndReturnPolicyHeader.set(
      this.res('SHIPPING_AND_RETURN_POLICY_HEADER')
    );
    this.safetyUsageDescriptionHeader.set(
      this.res('SAFETY_AND_USAGE_DESCRIPTION_HEADER')
    );
    metaDataService.getMetadata().subscribe((metadata) => {
      this.freeShippingThresholdString.set(
        currencyPipe.transform(metadata.freeShippingThreshold) ?? ''
      );
      this.subPriceMetaInfos.set([
        this.res('SECURE_CHECKOUT'),
        this.res('ORDER_RETURN_TIMESPAN').replace(
          '{X}',
          metadata.shippingReturnThreshold
        )
      ]);
      this.shippingAndReturnPolicy.set(
        metadata.shippingAndReturnPolicyDescription ?? ''
      );
    });
    shippingService.getShippingTimeEstimation().subscribe((estimation) => {
      this.shippingDeliveryEstimationString.set(
        this.res('SHIPPING_TIME_ESTIMATION_STRING')
          .replace('{X}', estimation.minDays)
          .replace('{Y}', estimation.maxDays)
      );
    });

    effect(() => {
      this.productService
        .getProductById(this.productId() ?? 0)
        .subscribe((data) => {
          this.productName.set(data.name);
          this.productPrice.set(data.price);
          this.productDescription.set(data.shortDescription);
          this.isProductInStock.set(data.isInStock);
          this.productHighlights.set(data.highlightDescriptions);
          this.productDescriptionExtended.set(data.detailDescription);
          this.safetyUsageDescription.set(data.safetyUsageDescription);
          if (data && data.images && data.images.length > 0) {
            this.carouselImages.set(
              data.images
                .slice(0, this.carouselImageMaxLength)
                .map((imageSpec) => {
                  return {
                    id: imageSpec.id,
                    fileId: imageSpec.fileId,
                    productId: imageSpec.productId,
                    fileContent: { dataUrl: '' }
                  };
                }) ?? []
            );
          }
        });
    });
  }

  public addProductToCart() {
    if (this.productId() && this.productName() && this.productPrice()) {
      this.cartService.pushCartItem({
        product: {
          id: this.productId(),
          name: this.productName(),
          images: [],
          price: this.productPrice()
        },
        count: this.productCount()
      });
      this.productCount.set(1);
    } else console.log('Adding product to cart failed. No product accessible.');
  }

  public updateProductCount(count: number) {
    this.productCount.set(count);
  }
}
