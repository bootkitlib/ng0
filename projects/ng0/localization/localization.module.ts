import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { TranslateEnumPipe } from './translate-enum.pipe';
import { TranslateBooleanPipe } from './translate-boolean-pipe';
import { DatePipe } from './date.pipe';

const Declares = [
  TranslatePipe,
  TranslateEnumPipe,
  TranslateBooleanPipe,
  DatePipe
];

@NgModule({
  imports: [
    CommonModule,
    ...Declares
  ],
  exports: Declares
})
export class LocalizationModule {
}

