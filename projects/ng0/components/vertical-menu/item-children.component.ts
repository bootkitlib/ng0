import { Component, ContentChild, inject, model } from '@angular/core';
import { VerticalMenuItemComponent } from './item.component';
import { CommonModule } from '@angular/common';
import { VerticalMenuComponent } from './vertical-menu.component';
import { CollapseDirective } from '@bootkit/ng0/components/collapse';

@Component({
    selector: 'ng0-vertical-menu-item-children, ng0-vmenu-item-children',
    templateUrl: './item-children.component.html',
    exportAs: 'ng0VmenuItemChildren',
    standalone: true,
    styles: `:host {display: block}`,
    imports: [CommonModule, CollapseDirective],
    host: {
        '[class.ng0-expanded]': 'menuItem.expanded()'
    }
})
export class VerticalMenuItemChildrenComponent {
    public menuItem = inject(VerticalMenuItemComponent);
    public menu = inject(VerticalMenuComponent);

    // @ContentChild(VerticalMenuItemComponent, { descendants: false })
    // protected _items?: VerticalMenuItemComponent;
}
