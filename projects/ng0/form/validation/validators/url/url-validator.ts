import { AbstractControl, ValidatorFn } from '@angular/forms';
const urlRegEx = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

export function urlValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
            const value = (control.value as string);
            if (!value || urlRegEx.test(value)) {
                  return null;
            } else {
                  return {
                        'url': {
                              value
                        }
                  };
            }
      };
}