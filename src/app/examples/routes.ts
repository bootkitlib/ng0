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
        title: 'Localization',
        loadChildren: () => import('./localization/routes')
    },
    {
        path: 'http',
        title: 'HTTP',
        loadChildren: () => import('./http/routes')
    },
    {
        path: 'form',
        title: 'Forms',
        loadChildren: () => import('./form/routes')
    },
    {
        path: 'components',
        title: 'Components',
        loadChildren: () => import('./components/routes')
    },
    {
        path: 'layouts',
        title: 'Layouts',
        loadChildren: () => import('./layouts/routes')
    },
    {
        path: 'platform/browser',
        title: 'Platform',
        loadChildren: () => import('./platform/browser/routes')
    },
] satisfies Route[];
