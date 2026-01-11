import { Component, ContentChild, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalMenuItemChildrenComponent } from './item-children.component';

@Component({
  selector: 'ng0-vertical-menu-item, ng0-vmenu-item',
  templateUrl: './item.component.html',
  standalone: true,
  styles: `:host {display: block}`,
  imports: [CommonModule],
  host: {
    '[class.ng0-has-children]': 'this.children != null',
    '[class.class.ng0-expanded]': 'expanded()'
  }
})
export class VerticalMenuItemComponent {
  // private readonly _menu = inject(VerticalMenuComponent);

  public readonly active = model(false);

  @ContentChild(VerticalMenuItemChildrenComponent, { descendants: false }) 
  public readonly children?: VerticalMenuItemChildrenComponent;

  /**
   * Whether the item is expaned.
   */
  public expanded = model(false);
}

