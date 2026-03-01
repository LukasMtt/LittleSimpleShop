import { Component, computed, signal } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { BaseComponent } from '../../shared/base.component';
import { CartShowItemComponent } from '../cart-show-item/cart-show-item.component';
import { TextBadgeComponent } from '../../shared/text-badge/text-badge.component';
import { MetadataService } from '../../../services/metadata.service';
import { CurrencyPipe } from '@angular/common';
import { ShippingService } from '../../../services/shipping.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { discountCodeValidator } from '../../../validators/discount-code.validator';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart-show',
  imports: [
    CartShowItemComponent,
    TextBadgeComponent,
    CurrencyPipe,
    ButtonComponent,
    ReactiveFormsModule,
    FormSectionComponent
  ],
  templateUrl: './cart-show.component.html',
  styleUrl: './cart-show.component.css'
})
export class CartShowComponent extends BaseComponent {
  cart = computed(() => {
    return this.cartService.cartReadonly();
  });
  cartItemProductIdsToDisplay = computed(() => {
    return this.cart()
      ?.cartItems?.filter((x) => x.amount > 0 && x.product)
      .map((x) => x.product.id);
  });
  cartPriceTotal = computed(() => {
    if (this.cart() !== undefined) {
      return this.cartService.getCartPriceSum();
    }
    return 'invalid sum';
  });
  bottomBadgesTextList = signal<string[]>([]);

  discountCodeFormGroup = new FormGroup({
    code: new FormControl('', [])
  });

  constructor(
    public cartService: CartService,
    metaDataService: MetadataService,
    shippingService: ShippingService,
    currencyPipe: CurrencyPipe
  ) {
    super();

    forkJoin([
      metaDataService.getMetadata(),
      shippingService.getShippingTimeEstimation()
    ]).subscribe(([metadata, estimation]) => {
      const textList: string[] = [];
      textList.push(
        this.res('FREE_SHIPPING_FROM').replace(
          '{X}',
          currencyPipe.transform(metadata.freeShippingThreshold) ?? ''
        )
      );
      textList.push(
        this.res('ORDER_RETURN_TIMESPAN').replace(
          '{X}',
          metadata.shippingReturnThreshold
        )
      );
      textList.push(
        this.res('SHIPPING_TIME_ESTIMATION_STRING')
          .replace('{X}', estimation.minDays)
          .replace('{Y}', estimation.maxDays)
      );
      this.bottomBadgesTextList.set(textList);
    });
  }

  public onSubmit() {
    let dynamicDiscountCodeValidator = discountCodeValidator();
    this.discountCodeFormGroup.controls.code.addValidators(
      dynamicDiscountCodeValidator
    );
    this.discountCodeFormGroup.controls.code.updateValueAndValidity();

    this.discountCodeFormGroup.controls.code.markAsTouched();
    this.discountCodeFormGroup.controls.code.markAsDirty();

    this.discountCodeFormGroup.controls.code.removeValidators(
      dynamicDiscountCodeValidator
    );
  }
}
