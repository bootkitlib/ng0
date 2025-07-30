import { NgModule } from '@angular/core';
import { NavDirective } from './nav.directive';
import { NavLinkDirective } from './nav-link.directive';
import { NavContentContainerComponent } from './nav-content-container.component';
import { NavContentDirective } from './nav-content.directive';
import { NavItemDirective } from './nav-item.directive';

const items = [
  NavDirective,
  NavItemDirective,
  NavLinkDirective,
  NavContentContainerComponent,
  NavContentDirective
];

@NgModule({
  imports: items,
  exports: items
})
export class NavModule {
}
