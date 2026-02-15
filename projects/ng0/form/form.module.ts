import { NgModule } from '@angular/core';
import { NumberDirective } from './number.directive';
import { FileValueAccessor } from './file-value-accessor';
import { ValidationModule } from './validation';

const items = [
  ValidationModule,

  // ErrorDirective,
  // FirstErrorDirective,
  NumberDirective,
  FileValueAccessor,
];

@NgModule({
  imports: items,
  exports: items,
})
export class FormModule { }
