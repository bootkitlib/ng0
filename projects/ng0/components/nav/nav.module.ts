import { NgModule } from '@angular/core';
import { NavDirective } from './nav.directive';
import { NavLinkDirective } from './nav-link.directive';
import { TabContentComponent } from './tab-content.component';
import { TabPaneDirective } from './tab-pane.directive';
import { NavItemDirective } from './nav-item.directive';

const items = [
  NavDirective,
  NavItemDirective,
  NavLinkDirective,
  TabContentComponent,
  TabPaneDirective
];

@NgModule({
  imports: items,
  exports: items
})
export class NavModule {
}
