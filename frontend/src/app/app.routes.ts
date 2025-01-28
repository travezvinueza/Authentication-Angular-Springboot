import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/components/layout/layout.component';

export const routes: Routes = [

  { path: '', redirectTo: '/pages/landing', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.default) },
      { path: 'pages', loadChildren: () => import('./pages/pages.routes').then(m => m.default) },
    ]
  },


  {
    path: 'pages/landing',
    loadComponent: () => import('./pages/landing/landing').then(m => m.Landing),
    title: 'Landing'
  },

  {
    path: 'shared/not-found',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: 'shared/access-denied',
    loadComponent: () => import('./shared/access-denied/access-denied.component').then(m => m.AccessDeniedComponent),
  },
  {
    path: 'shared/error',
    loadComponent: () => import('./shared/error/error.component').then(m => m.ErrorComponent),
  },

  { path: '**', redirectTo: '/shared/not-found' }

];
