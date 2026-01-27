import { NgModule } from '@angular/core';
import { VerticalMenuItemComponent } from './item.component';
import { VerticalMenuComponent } from './vertical-menu.component';
import { VerticalMenuDividerComponent } from './divider.component';
import { VerticalMenuHeaderComponent } from './header.component';
import { VerticalMenuItemChildrenComponent } from './item-children.component';

const items = [
  VerticalMenuComponent,
  VerticalMenuItemComponent,
  VerticalMenuItemChildrenComponent,
  VerticalMenuDividerComponent,
  VerticalMenuHeaderComponent
];

@NgModule({
  imports: items,
  exports: items
})
export class VerticalMenuModule {
}
