import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'ng0Translate',
  standalone: true,
  pure: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private _ls: LocalizationService) {
  }

  transform(dictionaryKey: string) {
    return this._ls.get()?.translate(dictionaryKey);
  }
}
