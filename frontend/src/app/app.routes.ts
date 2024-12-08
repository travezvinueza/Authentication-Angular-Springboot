import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect root to '/login'
  { path: 'login', component: LoginComponent, title: 'Login' }, // Login route
  { path: 'register', component: RegisterComponent, title: 'Register' }, // Register route
  { path: 'userHome', component: HomeComponent, title: 'User' }, // User home
  { path: 'adminHome', component: AdminComponent, title: 'Admin' }, // Admin home
  { path: '**', redirectTo: '/login' } // Wildcard route for unmatched paths
];
