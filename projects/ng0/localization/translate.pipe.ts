import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';


/**
 * Pipe to translate a dictionary key into a localized string.
 * It uses the LocalizationService to fetch the translation.
 * If the translation is not found, it returns the fallback string if provided.
 */
@Pipe({
  name: 'ng0Translate',
  standalone: true,
  pure: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private _ls: LocalizationService) {
  }

  transform(dictionaryKey: string, fallback?: string) {
    return this._ls.get()?.translate(dictionaryKey, fallback) || dictionaryKey;
  }
}
