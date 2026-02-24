import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileMaxSizeValidator(size: number): ValidatorFn {
  if (size == null || size <= 0) {
    throw new Error('Size must be a positive number');
  }

  return (control: AbstractControl): { [key: string]: any } | null => {
    let value = control?.value as FileList | File | undefined;

    if (value instanceof File) {
      return value.size > size ? {
        fileMaxSize: {
          file: value,
          max: size,
          multiple: false
        }
      } : null;
    } else if ((value as FileList)?.length > 0) {
      const fileList = value as FileList;

      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].size > size) {
          return {
            fileMaxSize: {
              file: fileList[i],
              fileList: fileList,
              max: size,
              multiple: true
            }
          };
        }
      }
      return null;
    } else {
      return null;
    }
  };
}
