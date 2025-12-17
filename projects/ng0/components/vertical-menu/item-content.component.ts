import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalMenuComponent } from './vertical-menu.component';
import { VerticalMenuItemComponent } from './item.component';

@Component({
  selector: 'ng0-vertical-menu-item-content, ng0-vmenu-item-content, ng0-vmenu-content',
  templateUrl: './item-content.component.html',
  standalone: true,
  styles: `:host {display: flex; align-items: center;  }`,
  imports: [CommonModule]
})
export class VerticalMenuItemContentComponent {
  protected readonly _menu = inject(VerticalMenuComponent);
  protected readonly menuItem = inject(VerticalMenuItemComponent);

  @HostListener('click')
  protected _onClick() {
    if (this._menu.expandItemsByClick() && this.menuItem.hasChildren) {
      this.menuItem.children?.expanded.update(x => !x);
    }
  }
}
