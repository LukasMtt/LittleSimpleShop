import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;

  constructor(private httpClient: HttpClient) { }

  loadAppConfig() {
    return this.httpClient.get('/assets/app.config.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  getConfigProperty(name: string) {
    if (!this.appConfig) {
      throw Error('Config file not loaded yet!');
    }
    var value = this.appConfig[name];
    if (!value) {
      return null;
    }
    return value;
  }
}
