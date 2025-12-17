import { Component, ContentChild, HostBinding, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalMenuItemChildrenComponent } from './item-children.component';
import { VerticalMenuComponent } from './vertical-menu.component';

@Component({
  selector: 'ng0-vertical-menu-item, ng0-vmenu-item',
  templateUrl: './item.component.html',
  standalone: true,
  styles: `:host {display: block}`,
  imports: [CommonModule],
  host: {
  }
})
export class VerticalMenuItemComponent {
  public readonly active = model(false);

  @ContentChild(VerticalMenuItemChildrenComponent, { descendants: false }) 
  public readonly children?: VerticalMenuItemChildrenComponent;

  constructor(protected _menu: VerticalMenuComponent) {
  }

  @HostBinding('class.ng0-has-children')
  public get hasChildren(): boolean {
    return this.children != null;
  }

  @HostBinding('class.ng0-expanded')
  public get isExpanded(): boolean {
    return this.children != null && this.children.expanded();
  }
}

