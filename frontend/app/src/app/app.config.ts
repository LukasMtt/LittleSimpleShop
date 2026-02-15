import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from './services/app.config.service';
import { ResourceService } from './services/resource.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { GermanMatPaginatorIntl } from './misc/mat-paginator-intl';
import { CurrencyPipe } from '@angular/common';

const appConfigServiceProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [AppConfigService],
  useFactory: (appConfigService: AppConfigService) => {
    return () => {
      return appConfigService.loadAppConfig();
    };
  }
};

const resourceServiceProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [ResourceService],
  useFactory: (resourceService: ResourceService) => {
    return () => {
      return resourceService.loadResources();
    };
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
    appConfigServiceProvider,
    resourceServiceProvider,
    [{ provide: MatPaginatorIntl, useClass: GermanMatPaginatorIntl }],
    CurrencyPipe
  ]
};
