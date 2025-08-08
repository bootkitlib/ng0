import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { TranslateEnumPipe } from './translate-enum.pipe';
import { TranslateBooleanPipe } from './translate-boolean-pipe';
import { DatePipe } from './date.pipe';
import { LocalizePipe } from './localize.pipe';
import { LocalizeEnumPipe } from './localize-enum.pipe';
import { LocalizeBooleanPipe } from './localize-boolean-pipe';
import { LocalizeDatePipe } from './localize-date.pipe';

const Declares = [
  // Pure pipes
  TranslatePipe,
  TranslateEnumPipe,
  TranslateBooleanPipe,
  DatePipe,

  // Impure pipes
  LocalizePipe,
  LocalizeEnumPipe,
  LocalizeBooleanPipe,
  LocalizeDatePipe
];

@NgModule({
  imports: Declares,
  exports: Declares
})
export class LocalizationModule {
}

