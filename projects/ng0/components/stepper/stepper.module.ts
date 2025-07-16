import { NgModule } from '@angular/core';
import { StepDirective } from './step.directive';
import { StepperComponent } from './stepper.component';

const items = [
  StepperComponent,
  StepDirective
];

@NgModule({
  imports: items,
  exports: items
})
export class StepperModule {
}
