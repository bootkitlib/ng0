import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { equalWithValidator } from './equal-with-validator';

@Directive({
      selector: '[ng0EqualWith]',
      exportAs: 'ng0EqualWith',
      standalone: true,
      providers: [
            { provide: NG_VALIDATORS, useExisting: EqualWithValidatorDirective, multi: true }
      ]
})
export class EqualWithValidatorDirective implements Validator {
      @Input('ng0EqualWith') targetValue?: string;
      @Input() inequalityMessage?: string;

      constructor() {
      }

      validate(control: AbstractControl): { [key: string]: any } | null {
            return equalWithValidator(this.targetValue, this.inequalityMessage)(control);
      }
}
