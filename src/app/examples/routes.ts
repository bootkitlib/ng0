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
        path: 'form',
        loadChildren: () => import('./form/routes')
    },
    {
        path: 'components',
        loadChildren: () => import('./components/routes')
    }
] satisfies Route[];
