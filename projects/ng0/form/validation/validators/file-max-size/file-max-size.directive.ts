import { Directive, input, numberAttribute } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { fileMaxSizeValidator } from './file-max-size-validator';

@Directive({
  selector: '[ngModel][ng0File][ng0FileMaxSize]',
  exportAs: 'ng0MaxFileSize',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: FileMaxSizeValidatorDirective, multi: true, }],
})
export class FileMaxSizeValidatorDirective implements Validator {
  /**
   * Maximum file size in bytes.
   */
  public readonly fileMaxSize = input.required({ alias: 'ng0FileMaxSize', transform: numberAttribute });

  validate(control: AbstractControl): ValidationErrors | null {
    return fileMaxSizeValidator(this.fileMaxSize())(control);
  }
}
