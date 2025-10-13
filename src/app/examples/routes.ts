import { Route } from '@angular/router';
import { BootKitExampleComponent } from './bootkit-example.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        component: BootKitExampleComponent,
    },
    {
        title: 'Localization',
        path: 'localization',
        loadChildren: () => import('./localization/routes')
    },
    {
        title: 'HTTP',
        path: 'http',
        loadChildren: () => import('./http/routes')
    },
    {
        title: 'Forms',
        path: 'form',
        loadChildren: () => import('./form/routes')
    },
    {
        title: 'Components', 
        path: 'components',
        data: {
            routerLink: '/components'
        },
        loadChildren: () => import('./components/routes')
    }
] satisfies Route[];
