import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Locale } from './locale';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
  name: 'ng0Enum',
  standalone: true,
  pure: false
})
export class EnumPipe implements PipeTransform {
  private _locale: Locale;
  private _recompute = true;
  private _value!: string;

  constructor(localeProvider: LocalizationService) {
    this._locale = localeProvider.get();

    localeProvider.change.pipe(takeUntilDestroyed()).subscribe(x => {
      this._locale = x.new;
      this._recompute = true;
    });
  }

  transform(enumValue?: string | null, ...args: string[]): string {
    if (this._recompute) {
      var enumName = args[0];
      var nullDictionaryKey = args[1];
      this._value = enumValue ?
        (this._locale.translateEnum(enumName, enumValue) ?? enumValue) :
        (nullDictionaryKey ? this._locale.translate(nullDictionaryKey) : '');

      this._recompute = false;
    }

    return this._value;
  }
}
