import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { NewsDTO } from '../models/api/news.dto';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getAllNews(): Observable<NewsDTO[]> {
    return this.httpClient.get<NewsDTO[]>(
      this.endpointResolveService.buildUrl(EndpointItem.GetAllNews, [])
    );
  }
}
