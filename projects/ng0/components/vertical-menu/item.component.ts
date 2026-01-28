import { booleanAttribute, Component, ContentChildren, EventEmitter, inject, input, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';
import { VerticalMenuItemState } from './item-state';
import { VerticalMenuState } from './vertical-menu-state';

@Component({
  selector: 'ng0-vmenu-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [VerticalMenuItemState],
  host: {
    '[class.ng0-has-children]': 'hasChildren()',
    '[class.ng0-expanded]': 'isExpanded()',
    '[class.ng0-active]': 'active()',
    '[class.ng0-active-route]': 'hasActiveRoute()'
  }
})
export class VerticalMenuItemComponent {
  protected _menuItemState = inject(VerticalMenuItemState);
  protected _menuState = inject(VerticalMenuState);
  @ContentChildren(VerticalMenuItemComponent) protected _children!: QueryList<VerticalMenuItemComponent>;

  public readonly text = input<string>();
  public readonly tag = input<string>();
  public readonly tagClass = input<string | string[]>();
  public readonly icon = input<string>();

  /**
   * Router link
   */
  public readonly link = input<string | string[]>();
  public readonly routerLinkActiveOptions = input<{ exact: boolean } | IsActiveMatchOptions>({ exact: true });
  public readonly href = input<string>();
  public readonly target = input<'_blank' | '_parent' | '_self' | '_top'>('_blank');
  public readonly active = input(false, { transform: booleanAttribute });

  @Output() public readonly itemClick = new EventEmitter<PointerEvent>();

  ngOnInit(): void {
    if (this._menuItemState.parent) {
      this._menuItemState.parent.childStates().push(this._menuItemState);
    }
  }

  public hasActiveRoute(): boolean {
    return this._menuItemState.hasActiveRoute();
  }

  public hasChildren(): boolean {
    return this._menuItemState.hasChildren();
  }

  public isExpanded(): boolean {
    return this._menuItemState.expanded();
  }

  protected _onExpanderClick(e: PointerEvent) {
    if (this.hasChildren()) {
      this._menuItemState.expanded.update(x => !x);
    }

    this.itemClick.emit(e);
  }

  protected _onRouteChange(isActive: boolean) {
    this._menuItemState.routeActivated.set(isActive);
  }
}

