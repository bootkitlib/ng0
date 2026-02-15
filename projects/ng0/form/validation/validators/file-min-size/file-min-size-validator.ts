import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileMinSizeValidator(size: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let file = control?.value;

    const res = (file instanceof File && file.size < size) ? {
      fileMinSize: {
        file: file,
        min: size,
      }
    } : null;

    return res;
  };
}
