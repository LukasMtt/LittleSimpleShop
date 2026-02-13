import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { FileContentInput } from '../models/component/file-content.input';

@Injectable({
  providedIn: 'root'
})
export class FileFetchService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  public getPublicImageResponseBlob(
    imageId: number,
    fileId: string
  ): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(
      this.endpointResolveService.buildUrl(EndpointItem.GetPublicImage, [
        { key: 'imageId', value: `${imageId}` },
        { key: 'fileId', value: `${fileId}` }
      ]),
      { observe: 'response', responseType: 'blob' }
    );
  }

  public readFileAsDataUrl(
    blob: Blob,
    contentType: string,
    fileContent: FileContentInput
  ) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      fileContent.dataUrl = `data:${contentType};${reader.result as string}`;
    });
    reader.readAsDataURL(blob);
  }
}
