import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'ng0Localize',
  standalone: true,
  pure: false
})
export class LocalizePipe implements PipeTransform {
  constructor(private _ls: LocalizationService) {
  }

  transform(dictionaryKey: string) {
    return this._ls.get()?.translate(dictionaryKey);
  }
}
