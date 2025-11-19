import { Component } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent extends BaseComponent {
  email: string = '';
  phone: string = '';

  constructor(private metaDataservice: MetadataService) {
    super();

    this.metaDataservice.getMetadata().subscribe((metadata) => {
      this.email = metadata.email;
      this.phone = metadata.phone;
    });
  }
}
