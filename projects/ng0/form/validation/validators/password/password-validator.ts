import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(options?: { minLength?: number }): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
            const value = (control.value as string);
            const invalid = {
                  'password': {
                        value: control.value,
                  }
            };

            if (value == null) {
                  return null;
            }
            
            if (Number.isInteger(options?.minLength)) {
                  return value.length >= options!.minLength! ? null : invalid;
            }

            return null;
      };
}