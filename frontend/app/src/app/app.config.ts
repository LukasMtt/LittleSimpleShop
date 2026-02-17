import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
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

const appConfigServiceProvider = provideAppInitializer(() => {
        const initializerFn = ((appConfigService: AppConfigService) => {
    return () => {
      return appConfigService.loadAppConfig();
    };
  })(inject(AppConfigService));
        return initializerFn();
      });

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
    provideAnimationsAsync(),
    provideHttpClient(),
    appConfigServiceProvider,
    resourceServiceProvider,
    [{ provide: MatPaginatorIntl, useClass: GermanMatPaginatorIntl }],
    CurrencyPipe
  ]
};
