import { InjectionToken } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Locale } from './locale';

export const LOCALE = new InjectionToken<Locale | LocalizationService>('LOCALE');

export interface TranslatedValidationError {
    /** Error key */
    key: string;
  
    /** Error object */
    value: any;
  
    /** localized error text */
    text?: string;
  }
  
  export interface LocaleChangeEvent {
    old?: Locale;
    new: Locale;
  }
  