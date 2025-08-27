import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'ng0TranslateEnum',
  standalone: true,
  pure: true
})
export class TranslateEnumPipe implements PipeTransform {
  constructor(private _ls: LocalizationService) {
  }

  /**
   * 
   * @param enumValue 
   * @param enumName 
   * @param nullValueKey 
   * @param returnEnumAsFallback
   * @param fallbackKey 
   * @returns 
   */
  transform(enumValue: string | number | null | undefined, enumName: string, fallback?: string): any {
    return this._ls.get()?.translateEnum(enumName, enumValue, fallback);
  }
}
