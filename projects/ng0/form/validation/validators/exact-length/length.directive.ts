import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { equalLengthValidatorFn } from './length-validator';

@Directive({
  selector: '[ng0Length]',
  exportAs: 'ng0Length',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: LengthDirective,
    multi: true
  }]
})
export class LengthDirective implements Validator {
  @Input('ng0Length') exactLength?: number;
  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    return equalLengthValidatorFn(this.exactLength)(control);
}

}
