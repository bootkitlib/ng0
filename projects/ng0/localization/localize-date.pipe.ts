import { Pipe, PipeTransform } from '@angular/core';
import { Locale } from './locale';
import { LocalizationService } from './localization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
  name: 'ng0LocalizeDate',
  standalone: true,
  pure: false
})
export class LocalizeDatePipe implements PipeTransform {
  private _value?: string;
  private _recompute = true;

  constructor(private _ls: LocalizationService) {
    _ls.change.pipe(takeUntilDestroyed()).subscribe(x => this._recompute = true);
  }

  transform(value: number | string, format?: string) {
    if (this._recompute) {
      this._value = this._ls.get()?.formatDate(value, format);
      this._recompute = false;
    }

    return this._value;
  }
}
