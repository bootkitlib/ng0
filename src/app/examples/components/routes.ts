import { Route } from '@bootkit/ng0/routing';
import { delay, of } from 'rxjs';

export default [
    {
        title: 'Accordion',
        path: 'accordion',
        loadChildren: () => import('./accordion/routes')
    },
    {
        title: 'Autocomplete',
        path: 'autocomplete',
        loadChildren: () => import('./autocomplete/routes')
    },
    {
        title: 'Button',
        path: 'button',
        loadChildren: () => import('./button/routes')
    },
    {
        title: 'Collapse',
        path: 'collapse',
        loadChildren: () => import('./collapse/routes'),
    },
    {
        title: 'Table',
        path: 'table',
        loadChildren: () => import('./table/routes'),
    },
    {
        title: 'Dropdown',
        path: 'dropdown',
        loadChildren: () => import('./dropdown/routes'),
    },
    {
        title: 'Form Field',
        path: 'formfield',
        loadChildren: () => import('./form-field/routes'),
    },
    {
        title: 'List',
        path: 'list',
        loadChildren: () => import('./list/routes'),
    },
    {
        title: 'Modal',
        path: 'modal',
        loadChildren: () => import('./modal/routes'),
    },
    {
        title: 'Offcanvas',
        path: 'offcanvas',
        loadChildren: () => import('./offcanvas/routes'),
    },
    {
        title: 'Pagination',
        path: 'pagination',
        loadChildren: () => import('./pagination/routes'),
    },
    {
        title: 'Popover',
        path: 'popover',
        loadChildren: () => import('./popover/routes'),
    },
    {
        title: 'Progress',
        path: 'progress',
        loadChildren: () => import('./progress/routes'),
    },
    {
        // title: 'Select',
        // title: (r, s) => {
        //     console.log(r,s );
        //     console.log(r.data);
        //     return r.data['r1'];
        // },
        path: 'select',
        data: {
            x: 123,
            title: (r: any, s: any) => {
                console.log(r, s);
                console.log(r.data);
                return r.data['r1'];
            },
            // link: (r: any, s: any) => {
            //     console.log(r, s);
            //     console.log(r.data);
            //     return r.data['r1'];
            // },
        },
        resolve: {
            r1: (r: any, s: any) => { return of('R1 resolved').pipe(delay(10)); }
        },
        loadChildren: () => import('./select/routes'),
    },
    {
        title: 'Sidenav',
        path: 'sidenav',
        loadChildren: () => import('./sidenav/routes'),
    },
    {
        title: 'Tabs',
        path: 'tabs',
        loadChildren: () => import('./tabs/routes'),
    },
    {
        title: 'Toast',
        path: 'toast',
        loadChildren: () => import('./toast/routes'),
    },
    {
        title: 'Tooltip',
        path: 'tooltip',
        loadChildren: () => import('./tooltip/routes'),
    },
    {
        title: 'Vertical Menu',
        path: 'vertical-menu',
        loadChildren: () => import('./vertical-menu/routes'),
    }
] satisfies Route[];
