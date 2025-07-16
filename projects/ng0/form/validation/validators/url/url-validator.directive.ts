import { Directive, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { urlValidator } from './url-validator';

@Directive({
  selector: 'input[ng0Url]',
  exportAs: 'ng0Url',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true }]
})
export class UrlValidatorDirective implements Validator {
  /** Directive is enabled or disabled */
  @Input() iscUrl?: boolean | string = true;

  validate(control: FormControl): ValidationErrors | null {
    return urlValidator()(control);
  }
}
