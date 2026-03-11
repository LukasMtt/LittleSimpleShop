import { Component, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MetadataService } from '../../services/metadata.service';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent extends BaseComponent {
  faqText = signal<SafeHtml>('');

  constructor(
    public sanitizer: DomSanitizer,
    metaDataService: MetadataService
  ) {
    super();
    metaDataService.getMetadata().subscribe((metaData) => {
      this.faqText.set(
        this.sanitizer.bypassSecurityTrustHtml(metaData.faqText || '')
      );
    });
  }
}
