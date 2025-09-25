import { Route } from '@angular/router';

export default [
    {
        path: 'accordion',
        loadChildren: () => import('./accordion/routes')
    },
    {
        path: 'autocomplete',
        loadChildren: () => import('./autocomplete/routes')
    },
    {
        path: 'button',
        loadChildren: () => import('./button/routes')
    },
    {
        path: 'collapse',
        loadChildren: () => import('./collapse/routes'),
    },
    {
        path: 'table',
        loadChildren: () => import('./table/routes'),
    },
    {
        path: 'dropdown',
        loadChildren: () => import('./dropdown/routes'),
    },
    {
        path: 'formfield',
        loadChildren: () => import('./form-field/routes'),
    },
    {
        path: 'list',
        loadChildren: () => import('./list/routes'),
    },
    {
        path: 'modal',
        loadChildren: () => import('./modal/routes'),
    },
    {
        path: 'offcanvas',
        loadChildren: () => import('./offcanvas/routes'),
    },
    {
        path: 'pagination',
        loadChildren: () => import('./pagination/routes'),
    },
    {
        path: 'popover',
        loadChildren: () => import('./popover/routes'),
    },
    {
        path: 'progress',
        loadChildren: () => import('./progress/routes'),
    },
    {
        path: 'select',
        loadChildren: () => import('./select/routes'),
    },
    {
        path: 'sidenav',
        loadChildren: () => import('./sidenav/routes'),
    },
    {
        path: 'tabs',
        loadChildren: () => import('./tabs/routes'),
    },
    {
        path: 'toast',
        loadChildren: () => import('./toast/routes'),
    },
    {
        path: 'tooltip',
        loadChildren: () => import('./tooltip/routes'),
    },
    {
        path: 'vertical-menu',
        loadChildren: () => import('./vertical-menu/routes'),
    }
] satisfies Route[];
