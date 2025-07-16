import { NgModule } from '@angular/core';
import { EqualWithValidatorDirective } from './validators/equal-with/equal-with.directive';
import { UrlValidatorDirective } from './validators/url/url-validator.directive';
import { CustomValidatorDirective } from './validators/custom/custom-validator.directive';

const items = [
  // ErrorDirective,
  // FirstErrorDirective,

  // Validators
  EqualWithValidatorDirective,
  UrlValidatorDirective,
  CustomValidatorDirective,
];

@NgModule({
  imports: items,
  exports: items,
})
export class ValidationModule { }
