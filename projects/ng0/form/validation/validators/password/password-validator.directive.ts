import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { passwordValidator } from './password-validator';

@Directive({
      selector: '[ng0Password]',
      exportAs:'ng0Password',
      providers: [
            { provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }
      ]
})
export class PasswordValidatorDirective implements Validator {
      constructor() { }

      validate(control: AbstractControl): { [key: string]: any } | null {
            return passwordValidator({
                  minLength: 4
            })(control);
      }
}
