import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProgressBarComponent,
  ],
  exports: [
    ProgressBarComponent,
  ]
})
export class ProgressBarModule { }
