import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(
    private httpClient: HttpClient,
    private endpointResolveService: EndpointResolveService
  ) {}

  getAllNews(): Observable<News[]> {
    return this.httpClient.get<News[]>(
      this.endpointResolveService.buildUrl(EndpointItem.GetAllNews, [])
    );
  }
}
