import {
  ApplicationConfig,
  inject,
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
  withInterceptors
} from '@angular/common/http';
import { AppConfigService } from './services/app.config.service';
import { ResourceService } from './services/resource.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { GermanMatPaginatorIntl } from './misc/mat-paginator-intl';
import { CurrencyPipe } from '@angular/common';
import { csrfInterceptor } from './interceptors/csrf.interceptor';
import { CookieService } from 'ngx-cookie-service';

const appConfigServiceAndAntiforgeryTokenProvider = provideAppInitializer(
  () => {
    const initializerFn = ((
      appConfigService: AppConfigService,
      httpClient: HttpClient
    ) => {
      return async () => {
        await appConfigService.loadAppConfig();
        const apiBaseEndpointUrl =
          appConfigService.getConfigProperty('apiBaseEndpointUrl');
        return httpClient
          .get<any>(
            `${apiBaseEndpointUrl}/shop/Antiforgery/GetAntiforgeryToken`,
            { withCredentials: true }
          )
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
      // todo: consider reestablishing when relative paths are applicable
      // withXsrfConfiguration({
      //   cookieName: 'XSRF-TOKEN',
      //   headerName: 'X-Xsrf-Header'
      // })
      withInterceptors([csrfInterceptor])
    ),
    appConfigServiceAndAntiforgeryTokenProvider,
    resourceServiceProvider,
    [{ provide: MatPaginatorIntl, useClass: GermanMatPaginatorIntl }],
    CurrencyPipe,
    CookieService
  ]
};
