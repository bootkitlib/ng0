import { Route } from '@angular/router';
import { BootKitExampleComponent } from './bootkit-example.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        component: BootKitExampleComponent,
    },
    {
        path: '',
        children: [
            {
                path: 'accordion',
                loadChildren: () => import('./accordion/routes')
            },
            {
                path: 'progress',
                loadChildren: () => import('./progress/routes'),
            },
            {
                path: 'tabs',
                loadChildren: () => import('./tabs/routes'),
            },
            {
                path: 'tooltip',
                loadChildren: () => import('./tooltip/routes'),
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
                path: 'modal',
                loadChildren: () => import('./modal/routes'),
            },
            {
                path: 'dropdown',
                loadChildren: () => import('./dropdown/routes'),
            },
            {
                path: 'collapse',
                loadChildren: () => import('./collapse/routes'),
            },
            {
                path: 'offcanvas',
                loadChildren: () => import('./offcanvas/routes'),
            },
            {
                path: 'toast',
                loadChildren: () => import('./toast/routes'),
            },
        ]
    },

] satisfies Route[];
