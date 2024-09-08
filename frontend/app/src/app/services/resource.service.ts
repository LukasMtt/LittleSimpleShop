import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({providedIn: 'root'})
export class ResourceService {

    private resources: any;

    constructor(private httpClient: HttpClient) {
    }

  async loadResources() {
    var getResources$ = this.httpClient.get('/assets/resources.de.json');
    this.resources = await lastValueFrom(getResources$);
  }

  get(name: string) {
    if (!this.resources) {
      throw Error('Resource file not loaded yet!');
    }
    var value = this.resources[name];
    if (!value) {
      return null;
    }
    return value;
  }
}