import { NgModule } from '@angular/core';
import { VerticalMenuItemComponent } from './item.component';
import { VerticalMenuComponent } from './vertical-menu.component';
import { VerticalMenuItemChildrenComponent } from './item-children.component';
import { VerticalMenuDividerComponent } from './divider.component';
import { VerticalMenuGroupComponent } from './group.component';

const items = [
  VerticalMenuDividerComponent,
  VerticalMenuGroupComponent,
  VerticalMenuItemChildrenComponent,
  VerticalMenuItemComponent,
  VerticalMenuComponent,
];

@NgModule({
  imports: items,
  exports: items
})
export class VerticalMenuModule {
}
