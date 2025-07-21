import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
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
  constructor(
    public menuItem: VerticalMenuItemComponent,
    private _renderer: Renderer2,
    private _el: ElementRef,
    protected _menu: VerticalMenuComponent,
  ) {
    // _renderer.addClass(_el.nativeElement, '')
  }

  @HostListener('click', ['$event'])
  private _onClick() {
    if (this._menu.toggleByItemClick() && this.menuItem.hasChildren) {
      this.menuItem.children?.expanded.update(x => !x);
    }
  }
}
