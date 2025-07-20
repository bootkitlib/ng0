import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpService } from '@bootkit/ng0/http';
import { withDefaultDataRequestResolver } from '@bootkit/ng0/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideHttpService({
      baseUrl: 'https://dummyjson.com/',
    }, withDefaultDataRequestResolver())
    // { provide: NZ_I18N, useValue: en_US },
    // { provide: LOCALE, useClass: LocaleProvider },
    // { provide: APP_CONFIGURATION, useValue: APP_CONFIGS },
  ]
};
