import { Component, computed, inject, input } from '@angular/core';
import { CardInput } from '../../../models/component/card.input';
import {
  EndpointItem,
  EndpointResolveService
} from '../../../services/endpoint.resolve.service';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  endpointResolveService = inject(EndpointResolveService);

  cardModel = input<CardInput | undefined>(undefined);
  routerLink = input<string>('');

  imgSrc = computed(() => {
    return this.endpointResolveService.buildUrl(EndpointItem.GetPublicImage, [
      { key: 'imageId', value: `${this.cardModel()?.image?.id ?? 0}` },
      { key: 'fileId', value: `${this.cardModel()?.image?.fileId ?? ''}` }
    ]);
  });
}
