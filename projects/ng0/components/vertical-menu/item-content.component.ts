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
  public readonly menu = inject(VerticalMenuComponent);
  public readonly menuItem = inject(VerticalMenuItemComponent);

  @HostListener('click')
  protected _onClick() {
    if (this.menu.expandItemsByClick() && this.menuItem.children != null) {
      this.menuItem.expanded.update(x => !x);
    }
  }
}
