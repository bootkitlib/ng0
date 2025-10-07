import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpDataRequestResolver, provideHttpService } from '@bootkit/ng0/http';
import { map } from 'rxjs';
import { DataResult } from '@bootkit/ng0/data';
import { LocalizationService } from '@bootkit/ng0/localization';
import { APP_FA_IR_LOCALE } from './common/locales/fa-ir';

const appHttpDataRequestResolver: HttpDataRequestResolver = (url, request, options) => {
  let http = inject(HttpClient);
  return http.get<{ products: any[], total: number }>(url, {
    params: {
      limit: request.page?.size ?? 10,
      skip: (request.page?.index! - 1) * request.page?.size!,
      q: request.filters?.at(0)?.value?.toString() ?? ''
    }
  }).pipe(
    map(x => new DataResult(x.products, x.total))
  )
}
// 
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: false }),
    // provideRouter(routes, withDebugTracing()),
    provideRouter(routes),
    // provideClientHydration(),
    provideHttpClient(),
    provideHttpService({
      baseUrl: 'https://dummyjson.com/',
      dataRequestResolver: appHttpDataRequestResolver,
    }),
    // { provide: NZ_I18N, useValue: en_US },
    // { provide: LOCALE, useClass: LocaleProvider },
    // { provide: APP_CONFIGURATION, useValue: APP_CONFIGS },
    provideAppInitializer(() => {
      var localizationService = inject(LocalizationService);
      localizationService.add(APP_FA_IR_LOCALE);
    }),
  ]
};
