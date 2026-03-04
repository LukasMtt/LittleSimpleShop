import { Component, signal } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { MetadataService } from '../../services/metadata.service';
import { CartService } from '../../services/cart.service';
import { ButtonComponent } from '../shared/button/button.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent extends BaseComponent {
  email: string = '';
  phone: string = '';

  orderToken = signal<string>('');
  constructor(
    private metaDataservice: MetadataService,
    private activatedRoute: ActivatedRoute,
    cartService: CartService
  ) {
    super();
    cartService.resetCart();
    this.activatedRoute.params.subscribe((params) => {
      this.orderToken.set(params['orderToken']);
    });
    this.metaDataservice.getMetadata().subscribe((metadata) => {
      this.email = metadata.shopEmail ?? '';
      this.phone = metadata.shopPhone ?? '';
    });
  }
}
