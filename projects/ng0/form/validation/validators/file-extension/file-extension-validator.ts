import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileExtensionValidator(allowedExtensions: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let file = control?.value;

    // const res = (file instanceof File && file.size > size) ? {
    //   fileExtension: {
    //     file: file,
    //     max: size,
    //   }
    // } : null;

    // return res;

    return null;
  };
}
