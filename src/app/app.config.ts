import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpDataRequestResolver, provideHttpService } from '@bootkit/ng0/http';
import { httpDataRequestResolver1 } from '@bootkit/ng0/http';
import { map } from 'rxjs';
import { DataResult } from '@bootkit/ng0/data';

const appDataResolver: HttpDataRequestResolver = (url, request, options) => {
  let http = inject(HttpClient);
  return http.get<{ products: any[], total: number }>(url, {}).pipe(
    map(x => new DataResult(x.products, x.total))
  )
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideHttpService({
      baseUrl: 'https://dummyjson.com/',
      // dataRequestResolver: httpDataRequestResolver1,
    })
    // { provide: NZ_I18N, useValue: en_US },
    // { provide: LOCALE, useClass: LocaleProvider },
    // { provide: APP_CONFIGURATION, useValue: APP_CONFIGS },
  ]
};
