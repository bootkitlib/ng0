import { Directive, input, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
      selector: '[ng0CustomValidator]',
      exportAs: 'ng0CustomValidator',
      standalone: true,
      providers: [
            { provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }
      ]
})
export class CustomValidatorDirective implements Validator {
      validator = input.required<(value: any) => ValidationErrors | null>({alias: 'ng0CustomValidator'});

      constructor() { }

      validate(control: AbstractControl): ValidationErrors | null {
            return this.validator()(control);
      }
}
