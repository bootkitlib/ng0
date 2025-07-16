import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Locale } from './locale';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
  name: 'ng0Translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private _locale: Locale;
  private _recompute = true;
  private _value!: string;

  constructor(localizationService: LocalizationService) {
    this._locale = localizationService.get();

    localizationService.change.pipe(takeUntilDestroyed()).subscribe(x => {
      this._locale = x.new;
      this._recompute = true;
    });
  }

  transform(dictionaryKey: string, ...args: unknown[]): string {
    if (this._recompute) {
      this._value = this._locale.translate(dictionaryKey);
      this._recompute = false;
    }

    return this._value;
  }
}
