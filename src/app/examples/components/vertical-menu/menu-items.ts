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
        tag: 'No show condition - always visible',
        routerLink: '.',
    },
    {
        text: 'Item 2',
        tag: 'Requires user to be NOT authenticated',
        routerLink: '.',
        user: false,
    },
    {
        text: 'Item 3',
        tag: 'Requires user to be authenticated',
        routerLink: '.',
        user: true,
    },
    {
        text: 'Item 4',
        tag: 'Requires user to have "salesperson" claim',
        routerLink: '.',
        user: 'salesperson',
    },
    {
        text: 'Item 5',
        tag: 'Requires user to have both "salesperson" and "bartender" claims',
        routerLink: '.',
        user: { all: ['salesperson', 'bartender'] },
    },
    {
        text: 'Item 6',
        tag: 'Requires user to have either "salesperson" or "bartender" claims',
        routerLink: '.',
        user: { any: ['salesperson', 'bartender'] },
    },
    {
        text: 'Sales',
        tag: 'Requires user to have "salesperson" claim',
        user: 'salesperson',
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