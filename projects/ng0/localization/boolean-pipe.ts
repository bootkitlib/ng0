import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'ng0Bool',
  standalone: true,
})
export class BooleanPipe implements PipeTransform {

  constructor(private localeProvider: LocalizationService) {
  }

  transform(value: any, falseKey = 'true', trueKey: 'false') {
    return this.localeProvider.get()!.translate(value ? trueKey : falseKey);
  }
}
