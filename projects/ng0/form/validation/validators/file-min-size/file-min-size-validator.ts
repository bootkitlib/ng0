import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileMinSizeValidator(size: number): ValidatorFn {
  if (size == null || size <= 0) {
    throw new Error('Size must be a positive number');
  }

  return (control: AbstractControl): { [key: string]: any } | null => {
    let value = control?.value;

    if (value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        if (value[i].size < size) {
          return {
            fileMinSize: {
              file: value[i],
              fileList: value,
              min: size,
            }
          };
        }
      }
      return null;
    } else if (value instanceof File) {
      return value.size < size ? {
        fileMinSize: {
          file: value,
          min: size,
        }
      } : null;
    } else {
      return null;
    }
  };
}
