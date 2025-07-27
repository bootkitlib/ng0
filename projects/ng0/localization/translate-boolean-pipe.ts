import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'ng0TranslateBool',
  standalone: true,
  pure: true
})
export class TranslateBooleanPipe implements PipeTransform {

  constructor(private localeProvider: LocalizationService) {
  }

  transform(value: any, falseKey: string = 'true', trueKey: string = 'false'): any {
    return this.localeProvider.get()?.translate(value ? trueKey : falseKey);
  }
}
