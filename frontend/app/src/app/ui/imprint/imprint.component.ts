import { Component, signal } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-imprint',
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.css'
})
export class ImprintComponent extends BaseComponent {
  imprintText = signal<SafeHtml>('');

  constructor(
    public sanitizer: DomSanitizer,
    metaDataService: MetadataService
  ) {
    super();
    metaDataService.getMetadata().subscribe((metaData) => {
      this.imprintText.set(
        this.sanitizer.bypassSecurityTrustHtml(metaData.imprintText || '')
      );
    });
  }
}
