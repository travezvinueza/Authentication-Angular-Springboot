import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { UserListComponent } from './admin/user-list/user-list.component';
import { RoleComponent } from './admin/role/role.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, 
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },
  { path: 'userHome', component: HomeComponent, title: 'User', canActivate: [authGuard] }, 
  { path: 'role', component: RoleComponent, title: 'Roles', canActivate: [adminGuard], }, 
  { path: 'user-list', component: UserListComponent, title: 'List', canActivate: [authGuard] },  
  { path: 'profile', component: ProfileComponent, title: 'Profile', canActivate: [authGuard] },
  { path: '**', redirectTo: '/auth/login' } 
];
