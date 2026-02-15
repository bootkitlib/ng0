import { Directive, input, numberAttribute } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { fileMinSizeValidator } from './file-min-size-validator';

@Directive({
  selector: '[ngModel][ng0File][ng0FileMinSize]',
  exportAs: 'ng0MinFileSize',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: FileMinSizeValidatorDirective, multi: true, }],
})
export class FileMinSizeValidatorDirective implements Validator {
  /**
   * Minimum file size in bytes.
   */
  public readonly fileMinSize = input.required({ alias: 'ng0FileMinSize', transform: numberAttribute });

  validate(control: AbstractControl): ValidationErrors | null {
    return fileMinSizeValidator(this.fileMinSize())(control);
  }
}
