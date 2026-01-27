import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseComponent } from '@bootkit/ng0/components/collapse';
import { VerticalMenuItemState } from './item-state';

@Component({
    selector: 'ng0-vmenu-item-children',
    templateUrl: './item-children.component.html',
    exportAs: 'ng0VmenuItemChildren',
    standalone: true,
    imports: [CommonModule, CollapseComponent],
    host: {
        '[class.ng0-expanded]': 'isExpanded()'
    }
})
export class VerticalMenuItemChildrenComponent implements OnInit {
    private _menuItemState = inject(VerticalMenuItemState);

    ngOnInit(): void {
        this._menuItemState.hasChildren.set(true);
    }

    public isExpanded() {
        return this._menuItemState.expanded();
    }

    public expand() {
        return this._menuItemState.expanded.set(true);
    }

    public collapse() {
        return this._menuItemState.expanded.set(false);
    }
}
