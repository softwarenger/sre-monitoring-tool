import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'metrics',
    loadComponent: () => import('./features/metrics/metrics').then(m => m.Metrics)
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services').then(m => m.Services)
  },
  {
    path: 'system',
    loadComponent: () => import('./features/system/system').then(m => m.System)
  }
];
