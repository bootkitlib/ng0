import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { fileSizeValidator } from './max-file-size';

@Directive({
  selector: '[ng0MaxFileSize]',
  exportAs: 'ng0MaxFileSize',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxFileSizeValidatorDirective, multi: true, }],
})
export class MaxFileSizeValidatorDirective implements Validator  {
  /** KB */
  @Input('maxSize') maxSize = 5 * 1024;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    return fileSizeValidator(this.maxSize)(control);
  }
}
