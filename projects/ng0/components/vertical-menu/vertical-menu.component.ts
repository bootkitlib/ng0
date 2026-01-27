import { AfterContentInit, Component, ContentChild, inject, input } from '@angular/core';
import { MenuItem } from '@bootkit/ng0/common';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { User, UserStore } from '@bootkit/ng0/security';
import { VerticalMenuItemComponent } from './item.component';
import { RouterModule } from '@angular/router';
import { VerticalMenuDividerComponent } from './divider.component';
import { VerticalMenuHeaderComponent } from './header.component';
import { VerticalMenuState } from './vertical-menu-state';
import { VerticalMenuItemTemplateDirective } from './item-template.directive';
import { VerticalMenuItemChildrenComponent } from "dist/ng0/components/vertical-menu";

@Component({
  selector: 'ng0-vmenu, ng0-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  standalone: true,
  styles: `:host {display: block}`,
  providers: [
    VerticalMenuState
  ],
  imports: [
    CommonModule,
    RouterModule,
    VerticalMenuItemComponent,
    VerticalMenuDividerComponent,
    VerticalMenuHeaderComponent,
    VerticalMenuItemChildrenComponent
],
})
export class VerticalMenuComponent implements AfterContentInit {
  protected readonly _userStore = inject<UserStore<User>>(UserStore);
  protected readonly _state = inject(VerticalMenuState);
  @ContentChild(VerticalMenuItemTemplateDirective) protected _itemTemplate?: VerticalMenuItemTemplateDirective;

  /**
   * Menu items
   */
  public readonly items = input<MenuItem[]>([]);

  ngAfterContentInit(): void {
    this._state.itemTemplate.set(this._itemTemplate?.templateRef);
  }

  protected _onActiveChange(item: MenuItem, isActive: boolean) {
    // item.active = isActive;
    // if (item.parent)
    //   item.parent.active = isActive;
  }
}

