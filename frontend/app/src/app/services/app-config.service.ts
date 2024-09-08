import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;

  constructor(private httpClient: HttpClient) { }

  async loadAppConfig() {
    var getConfig$ = this.httpClient.get('/assets/app.config.json');
    this.appConfig = await lastValueFrom(getConfig$);
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
