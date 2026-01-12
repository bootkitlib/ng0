import { Component, ContentChild, EventEmitter, inject, input, model, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalMenuItemChildrenComponent } from './item-children.component';
import { VerticalMenuComponent } from './vertical-menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ng0-vmenu-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule],
  host: {
    '[class.ng0-has-children]': 'this.children != null',
    '[class.ng0-expanded]': 'expanded()',
    '[class.active]': 'isActive()'
  }
})
export class VerticalMenuItemComponent {
  private _isActive = false;
  public readonly menu = inject(VerticalMenuComponent);

  public readonly text = input<string>();
  public readonly link = input<string | string[]>();

  @ContentChild(VerticalMenuItemChildrenComponent, { descendants: false })
  public readonly children?: VerticalMenuItemChildrenComponent;

  /**
   * Whether the item is expaned.
   */
  public expanded = model(false);

  @Output() public itemClick = new EventEmitter<PointerEvent>();

  protected _onContentClick(e: PointerEvent) {
    if (this.menu.expandItemsByClick() && this.children != null) {
      this.expanded.update(x => !x);
    }

    this.itemClick.emit(e);
  }

  protected _onActiveChange(isActive: boolean) {
    this._isActive = isActive;
  }

  public isActive() {
    return this._isActive;
  }
}

