import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router';

import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withXsrfConfiguration
} from '@angular/common/http';
import { AppConfigService } from './services/app.config.service';
import { ResourceService } from './services/resource.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { GermanMatPaginatorIntl } from './misc/mat-paginator-intl';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { csrfInterceptor } from './interceptors/csrf.interceptor';
import { CookieService } from 'ngx-cookie-service';

//static yet, make configurable
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);

const appConfigServiceAndAntiforgeryTokenProvider = provideAppInitializer(
  () => {
    const initializerFn = ((
      appConfigService: AppConfigService,
      httpClient: HttpClient
    ) => {
      return async () => {
        await appConfigService.loadAppConfig();
        return httpClient
          .get<any>(`/shop/Antiforgery/GetAntiforgeryToken`, {
            withCredentials: true
          })
          .subscribe();
      };
    })(inject(AppConfigService), inject(HttpClient));
    return initializerFn();
  }
);

const resourceServiceProvider = provideAppInitializer(() => {
  const initializerFn = ((resourceService: ResourceService) => {
    return () => {
      return resourceService.loadResources();
    };
  })(inject(ResourceService));
  return initializerFn();
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideHttpClient(
      // we get two cookies and XSRF_TOKEN is essential for Angular because it is readable by the client
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    ),
    appConfigServiceAndAntiforgeryTokenProvider,
    resourceServiceProvider,
    [{ provide: MatPaginatorIntl, useClass: GermanMatPaginatorIntl }],
    // static yet, make configurable
    [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    CurrencyPipe,
    CookieService
  ]
};
