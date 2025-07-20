import { Pipe, PipeTransform } from '@angular/core';
import { Locale } from './locale';
import { LocalizationService } from './localization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
  name: 'ng0Date',
  standalone: true
})
export class DatePipe implements PipeTransform {
  private _locale: Locale;
  private _value!: string;

  constructor(localeProvider: LocalizationService) {
    this._locale = localeProvider.get()!;

    localeProvider.change.pipe(takeUntilDestroyed()).subscribe(x => {
      this._locale = x.new;
    });
  }

  transform(value: number | string): string {
    return this._locale.formatDate(value, '');
  }
}
