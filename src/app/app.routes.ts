import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/preferences',
    loadComponent: () => import('./features/profile/preferences/preferences').then(m => m.PreferencesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notification-center').then(m => m.NotificationCenterComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'metrics',
    loadComponent: () => import('./features/metrics/metrics').then(m => m.Metrics),
    canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services').then(m => m.Services),
    canActivate: [AuthGuard]
  },
  {
    path: 'system',
    loadComponent: () => import('./features/system/system').then(m => m.System),
    canActivate: [AuthGuard]
  }
];
