import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileMaxSizeValidator(size: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let file = control?.value;

    const res = (file instanceof File && file.size > size) ? {
      fileMaxSize: {
        file: file,
        max: size,
      }
    } : null;

    return res;
  };
}
