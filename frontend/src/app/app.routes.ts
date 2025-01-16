import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.default) },

  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    title: 'Profile',
    canActivate: [authGuard]
  },
  {
    path: 'shared/cod404',
    loadComponent: () => import('./shared/cod404/cod404.component').then(m => m.Cod404Component),
  },

  { path: '**', redirectTo: '/shared/cod404' }

];
