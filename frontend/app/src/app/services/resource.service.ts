import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ResourceService {

    private resources: any;

    constructor(private httpClient: HttpClient) {
    }

  loadResources() {
    return this.httpClient.get('/assets/resources.de.json')
      .toPromise()
      .then(data => {
        this.resources = data;
      });
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