import { Directive, input, numberAttribute } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';

/** Min validator */
@Directive({
  selector: 'input[type=text][ng0Number][min]',
  exportAs: 'ng0Min',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: MinValidatorDirective,
    multi: true
  }]
})
export class MinValidatorDirective implements Validator {
  min = input.required<number, number | string | undefined | null>({
    transform: numberAttribute,
  });

  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.min(this.min())(control);
  }
}
