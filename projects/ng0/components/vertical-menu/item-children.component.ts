import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseComponent } from '@bootkit/ng0/components/collapse';

@Component({
    selector: 'ng0-vmenu-item-children, ng0-vmenu-children',
    templateUrl: './item-children.component.html',
    exportAs: 'ng0VmenuItemChildren',
    standalone: true,
    imports: [CommonModule, CollapseComponent, CollapseComponent],
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
