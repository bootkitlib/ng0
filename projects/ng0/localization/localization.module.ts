import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { EnumPipe } from './enum.pipe';
import { BooleanPipe } from './boolean-pipe';
import { DatePipe } from './date.pipe';

const Declarables = [
  TranslatePipe,
  EnumPipe,
  BooleanPipe,
  DatePipe
];

@NgModule({
  imports: [
    CommonModule,
    Declarables
  ],
  exports: Declarables
})
export class LocalizationModule {
}

