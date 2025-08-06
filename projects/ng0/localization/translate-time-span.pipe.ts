import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './public-api';
import { TimeSpan } from '@bootkit/ng0/date';

/**
 * Pipe to format a number of milliseconds into a human-readable time span.
 * @example
 * {{ 123456789 | ng0TimeSpan }} // Outputs: "1 روز و 10 ساعت و 17 دقیقه و 36 ثانیه"
 */
@Pipe({
  name: 'ng0TranslateTimeSpan',
  pure: true
})
export class TimeSpanPipe implements PipeTransform {
  constructor(private _ls: LocalizationService) {
  }

  transform(value: number, percision: 'minute' | 'hour' | 'day' = 'minute'): string {
    if (value === null || value === undefined) {
      return '';
    }

 
    const and = ' و ';
    var ts = TimeSpan.fromMilliseconds(value);
    var s = '';

    if (ts.months == 0 && ts.days == 0 && ts.hours == 0 && ts.minutes == 0) {
      s = `0`;
    } else {
      if (ts.months > 0) {
        s += `${ts.months} ماه ${and}`;
      }

      if (ts.days > 0) {
        s += `${ts.days} روز ${and}`;
      }

      if (ts.hours > 0) {
        s += `${ts.hours} ساعت ${and}`;
      }

      if (ts.minutes > 0) {
        s += `${ts.minutes} دقیقه ${and}`;
      }

      s = s.substring(0, s.length - and.length);
    }

    return s;
  }
}
