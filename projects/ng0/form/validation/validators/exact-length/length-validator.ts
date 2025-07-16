import { AbstractControl, ValidatorFn } from '@angular/forms';

export function equalLengthValidatorFn(exactLength?: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = control.value?.length === exactLength;
    return isValid || !control.value
      ? null
      : {
          exactLength: exactLength,
        };
  };
}
