import { NgModule } from '@angular/core';
// import { ProgressbarComponent } from './progressbar/progressbar.component';
import { ProgressbarIndeterminateComponent } from './progressbar-indeterminate/progressbar-indeterminate.component';
import { ProgressComponent } from './progress.component';

const DECLARES = [
  ProgressComponent,
  // ProgressbarComponent,
  ProgressbarIndeterminateComponent
];

@NgModule({
  imports: DECLARES,
  exports: DECLARES
})
export class ProgressbarModule {
}
