import { Injectable } from '@angular/core';
import { JsonSerializer } from 'typescript-json-serializer';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  private serializer: JsonSerializer;

  constructor() {
    this.serializer = new JsonSerializer();
  }

  getSerializer() {
    return this.serializer;
  }
}
