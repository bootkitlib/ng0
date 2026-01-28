import { MenuItem } from "@bootkit/ng0/common";

export const menuItems1: MenuItem[] = [
    {
        type: 'node',
        text: 'Item 1',
        routerLink: '.',
        target: '_blank'
    },
    {
        type: 'divider',
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

export const menuItems2: MenuItem[] = [
    {
        text: 'Item 1',
        tag: 'No permission',
        routerLink: '.',
    },
    {
        text: 'Item 2',
        tag: 'Requires user identity',
        routerLink: '.',
    },
    {
        text: 'Item 3',
        tag: 'Requires "admin" claim',
        routerLink: '.',
        // claim: {},
    },
    {
        text: 'Item 2',
        tag: 'Requires user identity',
        claim: {},
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