import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let value = control?.value;
    const res = value instanceof File && value.size > (maxSize * 1024) ? {
        maxFileSize: {
          maxSize: maxSize,
          value: value
        }
      } : null;

      return res;
  };
}
