import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customValidator(validator: (value: any) => ValidationErrors | null): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
            return validator(control.value);
      };
}
