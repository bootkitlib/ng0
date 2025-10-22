import { inject, Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';
import { createObjectFormatter, ObjectFormatterLike } from './formatter';

/**
 * Format pipe to format objects using various formatter types.
 */
@Pipe({
  name: 'ng0Format',
  standalone: true,
  pure: true
})
export class FormatPipe implements PipeTransform {
  private _localizationService = inject(LocalizationService, { optional: true });

  transform(obj: any, formatter: ObjectFormatterLike, ...params: any[]): any {
    return createObjectFormatter(formatter, this._localizationService?.get())(obj, ...params);
  }
}
