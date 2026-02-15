import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { fileExtensionValidator } from './file-extension-validator';

@Directive({
  selector: '[ngModel][ng0File][ng0FileExtension]',
  exportAs: 'ng0MaxFileSize',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: FileExtensionValidatorDirective, multi: true, }],
})
export class FileExtensionValidatorDirective implements Validator {
  /**
   * Allowed file extensions.
   */
  public readonly allowedExtensions = input.required<string[]>({ alias: 'ng0FileExtension' });

  validate(control: AbstractControl): ValidationErrors | null {
    return fileExtensionValidator(this.allowedExtensions())(control);
  }
}
