import { Component, signal } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent extends BaseComponent {
  contactText = signal<SafeHtml>('');

  constructor(
    public sanitizer: DomSanitizer,
    metaDataService: MetadataService
  ) {
    super();
    metaDataService.getMetadata().subscribe((metaData) => {
      this.contactText.set(
        this.sanitizer.bypassSecurityTrustHtml(metaData.contactText || '')
      );
    });
  }
}
