import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { UserListComponent } from './admin/user-list/user-list.component';
import { RoleComponent } from './admin/role/role.component';
import { ProfileComponent } from './components/profile/profile.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, 
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },
  { path: 'userHome', component: HomeComponent, title: 'User', canActivate: [authGuard] }, 
  { path: 'role', component: RoleComponent, title: 'Roles', canActivate: [roleGuard(['ADMIN'])], }, 
  { path: 'user-list', component: UserListComponent, title: 'List', canActivate: [roleGuard (['ADMIN'])] },  
  { path: 'profile', component: ProfileComponent, title: 'Profile', canActivate: [authGuard, roleGuard (['ADMIN', 'USER'])] },
  {
    path: 'shared/cod404',
    loadComponent: () => import('./shared/cod404/cod404.component').then(m => m.Cod404Component),
  },
  { path: '**', redirectTo: '/shared/cod404' } 
];
