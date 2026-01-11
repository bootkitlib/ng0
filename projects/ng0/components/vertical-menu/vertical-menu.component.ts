import { Component, ContentChild, inject, input } from '@angular/core';
import { VerticalMenuArrowDirective } from './item-arrow.directive';
import { MenuItem } from '@bootkit/ng0/common';
import { CommonModule } from '@angular/common';
import { User, UserStore } from '@bootkit/ng0/security';
import { VerticalMenuItemComponent } from './item.component';
import { VerticalMenuItemChildrenComponent } from './item-children.component';
import { VerticalMenuItemContentComponent } from './item-content.component';
import { RouterModule } from '@angular/router';
import { VerticalMenuDividerComponent } from './divider.component';
import { VerticalMenuGroupComponent } from './group.component';

@Component({
  selector: 'ng0-vertical-menu, ng0-vmenu',
  templateUrl: './vertical-menu.component.html',
  standalone: true,
  styles: `:host {display: block}`,
  imports: [
    CommonModule,
    RouterModule,
    VerticalMenuItemComponent,
    VerticalMenuItemChildrenComponent,
    VerticalMenuItemContentComponent,
    VerticalMenuDividerComponent,
    VerticalMenuGroupComponent
  ],
})
export class VerticalMenuComponent {
  protected _userStore = inject<UserStore<User>>(UserStore);

  public items = input<MenuItem[]>();

  /**
   * Whether to expand/collapse items when clicking on them
   */
  public readonly expandItemsByClick = input(true);

  /**
   * collapse timings
   */
  public readonly collapseTimings = input<string | number>('0.15s');

  @ContentChild(VerticalMenuArrowDirective, { descendants: false })
  public readonly arrowDirective?: VerticalMenuArrowDirective;

  protected _onActiveChange(item: MenuItem, isActive: boolean) {
    // item.active = isActive;
    // if (item.parent)
    //   item.parent.active = isActive;
  }
}

