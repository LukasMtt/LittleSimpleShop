import { Component, computed, effect, input, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  productDescription = signal<SafeHtml>('');
  productDescriptionExtended = signal<SafeHtml>('');
  productDescriptionExtendedHeader = signal<string>('');
  safetyUsageDescription = signal<SafeHtml>('');
  safetyUsageDescriptionHeader = signal<string>('');
  productCount = signal<number>(1);
  isProductInStock = signal<boolean>(false);
  productMainImage = signal<DisplayImageInput>({ id: 0 });
  productHighlights = signal<string[]>([]);
  carouselImages = signal<DisplayImageInput[]>([]);
  subPriceMetaInfos = signal<string[]>([]);
  shippingAndReturnPolicy = signal<SafeHtml>('');
  shippingAndReturnPolicyHeader = signal<string>('');
  freeShippingString = signal<string>('');
  freeShippingThresholdString = signal<string>('');
  shippingDeliveryEstimationString = signal<string | undefined>(undefined);
  currency = signal<string>('USD');

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
    metaDataService: MetadataService,
    shippingService: ShippingService,
    currencyPipe: CurrencyPipe,
    sanitizer: DomSanitizer
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
      this.currency.set(metadata.currency ?? 'USD');
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
        sanitizer.bypassSecurityTrustHtml(
          metadata.shippingAndReturnPolicyDescription ?? ''
        )
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
        .subscribe((product) => {
          this.productName.set(product.name);
          this.productPrice.set(product.price);
          this.productDescription.set(
            sanitizer.bypassSecurityTrustHtml(product.shortDescription)
          );
          this.isProductInStock.set(product.isInStock);
          this.productHighlights.set(product.highlightDescriptions);
          this.productDescriptionExtended.set(
            sanitizer.bypassSecurityTrustHtml(product.detailDescription)
          );
          this.safetyUsageDescription.set(
            sanitizer.bypassSecurityTrustHtml(product.safetyUsageDescription)
          );
          if (product && product.images && product.images.length > 0) {
            this.productMainImage.set({
              ...product.images[0],
              fileContent: { dataUrl: '' }
            });
            this.carouselImages.set(
              product.images
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
        productId: this.productId(),
        product: {
          id: this.productId(),
          name: this.productName(),
          image: this.productMainImage(),
          price: this.productPrice()
        },
        amount: this.productCount()
      });
      this.productCount.set(1);
    } else console.log('Adding product to cart failed. No product accessible.');
  }

  public updateProductCount(count: number) {
    this.productCount.set(count);
  }
}
