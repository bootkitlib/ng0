import { Directive, input, numberAttribute } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';

/** Max validator */
@Directive({
  selector: 'input[type=text][ng0Number][max]',
  exportAs: 'ng0Max',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: MaxValidatorDirective,
    multi: true
  }]
})
export class MaxValidatorDirective implements Validator {
  max = input.required<number, number | string | undefined | null>({
    transform: numberAttribute,
  });

  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.max(this.max())(control);
  }
}
