import { AbstractControl, ValidatorFn } from '@angular/forms';

export function equalWithValidator(targetValue?: string, inequalityMessage?: string): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
            const isValid = control.value === targetValue;

            return isValid ? null :
                  {
                        equalWith: {
                              value: control.value,
                              message: inequalityMessage
                        }
                  };
      };
}
