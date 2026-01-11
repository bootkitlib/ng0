import { NgModule } from '@angular/core';
import { VerticalMenuItemComponent } from './item.component';
import { VerticalMenuComponent } from './vertical-menu.component';
import { VerticalMenuItemChildrenComponent } from './item-children.component';
import { VerticalMenuArrowDirective } from './item-arrow.directive';
import { VerticalMenuItemContentComponent } from './item-content.component';
import { VerticalMenuDividerComponent } from './divider.component';
import { VerticalMenuGroupComponent } from './group.component';

const items = [
  VerticalMenuComponent,
  VerticalMenuItemComponent,
  VerticalMenuItemChildrenComponent,
  VerticalMenuItemContentComponent,
  VerticalMenuArrowDirective,
  VerticalMenuDividerComponent,
  VerticalMenuGroupComponent
];

@NgModule({
  imports: items,
  exports: items
})
export class VerticalMenuModule {
}
