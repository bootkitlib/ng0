import { NgModule } from '@angular/core';
import { EqualWithValidatorDirective } from './validators/equal-with/equal-with.directive';
import { UrlValidatorDirective } from './validators/url/url-validator.directive';
import { CustomValidatorDirective } from './validators/custom/custom-validator.directive';
import { MinValidatorDirective } from './validators/min/min-validator.directive';
import { MaxValidatorDirective } from './validators/max/max-validator.directive';
import { FileMaxSizeValidatorDirective } from './validators/file-max-size/file-max-size.directive';
import { FileMinSizeValidatorDirective } from './validators/file-min-size/file-min-size.directive';


const items = [
  MinValidatorDirective,
  MaxValidatorDirective,
  
  FileMinSizeValidatorDirective,
  FileMaxSizeValidatorDirective,
  
  EqualWithValidatorDirective,
  UrlValidatorDirective,
  CustomValidatorDirective,
];

@NgModule({
  imports: items,
  exports: items,
})
export class ValidationModule { }
