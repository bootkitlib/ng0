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
export class VerticalMenuExampleComponent {
    _menuItems: MenuItem[] = [
        {
            type: 'item',
            text: 'Item 1',
            routerLink: '.',
            target: '_blank'
        },
        {
            type: 'divider'
        },
        {
            type: 'group',
            text: 'Group 1',
            children: [
                {
                    type: 'item',
                    text: 'Item 1',
                    routerLink: '.',
                },
                {
                    type: 'item',
                    text: 'Item 1',
                    routerLink: '.',
                    children: [
                        {
                            type: 'item',
                            text: 'Item 1',
                            routerLink: '.',
                        },
                    ]
                },
            ]
        },
    ];

    protected _onActiveChange(item: MenuItem, isActive: boolean) {
        // item.active = isActive;
        // if (item.parent)
        //     item.parent.active = isActive;
    }

    _onItemClick() {
        alert('Thank you!');
    }
}
