import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from './services/app.config.service';
import { ResourceService } from './services/resource.service';

const appConfigServiceProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [AppConfigService],
  useFactory: (appConfigService: AppConfigService) => {
    return () => {
      return appConfigService.loadAppConfig();
    };
  }
}

const resourceServiceProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [ResourceService],
  useFactory: (resourceService: ResourceService) => {
    return () => {
      return resourceService.loadResources();
    };
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), 
    provideAnimationsAsync(), 
    provideHttpClient(),
    appConfigServiceProvider,
    resourceServiceProvider
  ]
};