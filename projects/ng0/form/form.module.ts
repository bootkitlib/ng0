import { NgModule } from '@angular/core';
import { EqualWithValidatorDirective } from './validation/validators/equal-with/equal-with.directive';
import { UrlValidatorDirective } from './validation/validators/url/url-validator.directive';
import { CustomValidatorDirective } from './validation/validators/custom/custom-validator.directive';
import { MinValidatorDirective } from './validation/validators/min/min-validator.directive';
import { MaxValidatorDirective } from './validation/validators/max/max-validator.directive';
import { NumberDirective } from './number.directive';

const items = [
  // ErrorDirective,
  // FirstErrorDirective,
  NumberDirective,

  // Validators
  MinValidatorDirective,
  MaxValidatorDirective,
  EqualWithValidatorDirective,
  UrlValidatorDirective,
  CustomValidatorDirective,
];

@NgModule({
  imports: items,
  exports: items,
})
export class FormModule { }
