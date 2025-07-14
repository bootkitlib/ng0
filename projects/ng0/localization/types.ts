import { InjectionToken } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Locale } from './locale';

export const LOCALE = new InjectionToken<Locale | LocalizationService>('LOCALE');

export interface LocalizedValidationError {
    /** Error key */
    key: string;
  
    /** Error object */
    value: any;
  
    /** Error localized text */
    text?: string;
  }
  
  export interface LocaleChangeEvent {
    oldLocale?: Locale;
    newLocale: Locale;
  }
  