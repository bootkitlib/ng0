import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
  name: 'ng0LocalizeEnum',
  standalone: true,
  pure: false
})
export class LocalizeEnumPipe implements PipeTransform {
  private _recompute = true;
  private _value?: string;

  constructor(private _ls: LocalizationService) {
    _ls.change.pipe(takeUntilDestroyed()).subscribe(x => this._recompute = true);
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
  transform(enumValue: string | number | null | undefined, enumName: string, returnEnumAsFallback = true): any {
    if (this._recompute) {
      this._value = this._ls.get()?.translateEnum(enumName, enumValue, returnEnumAsFallback);
      this._recompute = false;
    }

    return this._value;
  }
}
