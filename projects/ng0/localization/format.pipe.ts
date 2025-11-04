import { EnvironmentInjector, inject, Pipe, PipeTransform, runInInjectionContext } from '@angular/core';
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
  private _injector = inject(EnvironmentInjector);
    
  transform(obj: any, formatter: ObjectFormatterLike, ...params: any[]): any {
    const f = runInInjectionContext(this._injector, createObjectFormatter.bind(null, formatter, ...params));
    return f(obj);
  }
}
