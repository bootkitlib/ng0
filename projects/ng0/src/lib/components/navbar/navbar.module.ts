import { NgModule } from '@angular/core';
import { NavbarCollapseDirective } from './navbar-collapse.directive';

@NgModule({
  declarations: [
    NavbarCollapseDirective
  ],
  exports: [
    NavbarCollapseDirective
  ]
})
export class NavbarModule {
}
