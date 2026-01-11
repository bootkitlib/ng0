import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from '@bootkit/ng0/common';
import { VerticalMenuModule } from '@bootkit/ng0/components/vertical-menu';

@Component({
    selector: 'app-examples-vertical-menu',
    templateUrl: './vertical-menu-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        VerticalMenuModule
    ]
})
export class TooltipExampleComponent {
    _menuItems: MenuItem[] = [
        {}
    ];

    protected _onActiveChange(item: MenuItem, isActive: boolean) {
        // item.active = isActive;
        // if (item.parent)
        //     item.parent.active = isActive;
    }
}
