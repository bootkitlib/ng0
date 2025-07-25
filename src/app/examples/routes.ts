import { Route } from '@angular/router';
import { BootKitExampleComponent } from './bootkit-example.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        component: BootKitExampleComponent,
    },
    {
        path: 'localization',
        loadChildren: () => import('./localization/routes')
    },
    {
        path: 'http',
        loadChildren: () => import('./http/routes')
    },

    {
        path: 'components',
        children: [
            {
                path: 'accordion',
                loadChildren: () => import('./components/accordion/routes')
            },
            {
                path: 'button',
                loadChildren: () => import('./components/button/routes')
            },
            {
                path: 'collapse',
                loadChildren: () => import('./components/collapse/routes'),
            },
            {
                path: 'table',
                loadChildren: () => import('./components/table/routes'),
            },
            {
                path: 'dropdown',
                loadChildren: () => import('./components/dropdown/routes'),
            },
            {
                path: 'formfield',
                loadChildren: () => import('./components/form-field/routes'),
            },
            {
                path: 'modal',
                loadChildren: () => import('./components/modal/routes'),
            },
            {
                path: 'offcanvas',
                loadChildren: () => import('./components/offcanvas/routes'),
            },
            {
                path: 'pagination',
                loadChildren: () => import('./components/pagination/routes'),
            },
            {
                path: 'popover',
                loadChildren: () => import('./components/popover/routes'),
            },
            {
                path: 'progress',
                loadChildren: () => import('./components/progress/routes'),
            },
            {
                path: 'sidenav',
                loadChildren: () => import('./components/sidenav/routes'),
            },
            {
                path: 'tabs',
                loadChildren: () => import('./components/tabs/routes'),
            },
            {
                path: 'toast',
                loadChildren: () => import('./components/toast/routes'),
            },
            {
                path: 'tooltip',
                loadChildren: () => import('./components/tooltip/routes'),
            },
        ]
    },

] satisfies Route[];
