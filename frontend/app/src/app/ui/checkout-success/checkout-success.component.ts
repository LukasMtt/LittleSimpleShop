import { Component } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { MetadataService } from '../../services/metadata.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-success',
  imports: [],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent extends BaseComponent {
  email: string = '';
  phone: string = '';

  //todo guard this route to match a string that is present as "order token"
  constructor(
    private metaDataservice: MetadataService,
    cartService: CartService
  ) {
    super();
    cartService.resetCart();
    this.metaDataservice.getMetadata().subscribe((metadata) => {
      this.email = metadata.shopEmail ?? '';
      this.phone = metadata.shopPhone ?? '';
    });
  }
}
