import { Routes } from '@angular/router';

export const routes: Routes = [
  
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.default) },
  { path: 'pages', loadChildren: () => import('./pages/pages.routes').then(m => m.default) },

  {
    path: 'shared/cod404',
    loadComponent: () => import('./shared/cod404/cod404.component').then(m => m.Cod404Component),
  },

  { path: '**', redirectTo: '/shared/cod404' }

];
