import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileMaxSizeValidator(size: number): ValidatorFn {
  if (size == null || size <= 0) {
    throw new Error('Size must be a positive number');
  }

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
