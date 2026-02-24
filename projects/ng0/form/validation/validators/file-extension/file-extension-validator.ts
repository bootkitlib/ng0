import { AbstractControl, ValidatorFn } from '@angular/forms';

function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export function fileExtensionValidator(allowedExtensions?: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (allowedExtensions === undefined) {
      return null;
    }

    let value = control?.value as FileList | File | undefined;

    if (value instanceof File) {
      const ext = getExtension(value.name);

      if (!allowedExtensions.includes(ext)) {
        return {
          fileExtension: {
            file: value,
            extension: ext,
            allowedExtensions: allowedExtensions,
          }
        };
      }

      return null;
    }
    else if ((value as FileList)?.length > 0) {
      const fileList = value as FileList;
      for (let i = 0; i < fileList.length; i++) {
        const ext = getExtension(fileList[i].name);

        if (!allowedExtensions.includes(ext)) {
          return {
            fileExtension: {
              file: fileList[i],
              extension: ext,
              allowedExtensions: allowedExtensions
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
