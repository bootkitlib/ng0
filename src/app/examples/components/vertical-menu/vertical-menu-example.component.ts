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
    VerticalMenuModule,
]
})
export class VerticalMenuExampleComponent {
    _menuItems: MenuItem[] = [
        {
            text: 'Item 1',
            routerLink: '.',
            target: '_blank'
        },
        {
            type: 'divider'
        },
        {
            text: 'Item 2',
            children: [
                {
                    text: 'Item 2.1',
                    routerLink: '.',
                },
                {
                    text: 'Item 2.2',
                    routerLink: '.',
                    children: [
                        {
                            text: 'Item 2.2.1',
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
