import { Component, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MetadataService } from '../../services/metadata.service';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent extends BaseComponent {
  aboutText = signal<SafeHtml>('');

  constructor(
    private sanitizer: DomSanitizer,
    metaDataService: MetadataService
  ) {
    super();
    metaDataService.getMetadata().subscribe((metaData) => {
      this.aboutText.set(
        this.sanitizer.bypassSecurityTrustHtml(metaData.aboutText || '')
      );
    });
  }
}
