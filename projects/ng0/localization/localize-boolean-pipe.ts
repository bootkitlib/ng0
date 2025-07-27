import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'ng0LocalizeBool',
  standalone: true,
  pure: false
})
export class LocalizeBooleanPipe implements PipeTransform {
  constructor(private _ls: LocalizationService) {
  }

  transform(value: any, falseKey = 'true', trueKey: 'false') {
    return this._ls.get()?.translate(value ? trueKey : falseKey);
  }
}
