import { Component, ContentChild, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalMenuItemChildrenComponent } from './item-children.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ng0-vmenu-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule],
  host: {
    '[class.ng0-has-children]': 'this.children != null',
    '[class.active]': 'isActive()'
  }
})
export class VerticalMenuItemComponent {
  private _isActive = false;

  public readonly text = input<string>();
  public readonly link = input<string | string[]>();
  public readonly icon = input<string>();
  public readonly target = input<'_blank' | '_parent' | '_self' | '_top'>();

  @ContentChild(VerticalMenuItemChildrenComponent, { descendants: false })
  public readonly children?: VerticalMenuItemChildrenComponent;

  @Output() public itemClick = new EventEmitter<PointerEvent>();

  protected _onContentClick(e: PointerEvent) {
    if (this.children != null) {
      this.children.expanded.update(x => !x);
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

