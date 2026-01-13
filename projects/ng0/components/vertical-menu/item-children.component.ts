import { Component, ContentChild, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalMenuComponent } from './vertical-menu.component';
import { CollapseDirective } from '@bootkit/ng0/components/collapse';

@Component({
    selector: 'ng0-vmenu-item-children, ng0-vmenu-children',
    templateUrl: './item-children.component.html',
    exportAs: 'ng0VmenuItemChildren',
    standalone: true,
    imports: [CommonModule, CollapseDirective],
    host: {
        '[class.ng0-expanded]': 'expanded()'
    }
})
export class VerticalMenuItemChildrenComponent {
    // public menu = inject(VerticalMenuComponent);

    /**
     * Whether the item is expanded.
     */
    public expanded = model(false);

    // @ContentChild(VerticalMenuItemComponent, { descendants: false })
    // protected _items?: VerticalMenuItemComponent;
}
