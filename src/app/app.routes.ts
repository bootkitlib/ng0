import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'examples',
    title: 'Examples',
    loadChildren: () => import('./examples/routes')
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'examples'
  }
];
