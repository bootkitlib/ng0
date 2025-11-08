import { EnvironmentInjector, inject, Pipe, PipeTransform, runInInjectionContext } from '@angular/core';
import { createDateFormatter } from './formatter';

@Pipe({
  name: 'ng0Date',
  standalone: true,
  pure: true
})
export class DatePipe implements PipeTransform {
  private _injector = inject(EnvironmentInjector);

  transform(value: Date | string | number,
    dateStyle?: 'short' | 'medium' | 'long' | 'full',
    timeStyle?: 'short' | 'medium' | 'long' | 'full',
    zone?: string[],
    calendar?: string): string;
  transform(value: Date | string | number, options?: Intl.DateTimeFormatOptions): string;
  transform(value: Date | string | number, ...options: any[]): string {
    const formatter = runInInjectionContext(this._injector, createDateFormatter.bind(null, ...options));
    return formatter(value);
  }
}
