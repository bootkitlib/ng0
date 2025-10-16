import { Routes } from '@bootkit/ng0/routing';

export const routes: Routes = [
  {
    path: 'examples',
    title: 'Examples',
    data: {
      link: ['/examples']
    },
    loadChildren: () => import('./examples/routes')
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'examples'
  }
];
