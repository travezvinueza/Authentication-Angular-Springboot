import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RoleComponent } from './components/role/role.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent, title: 'Login' }, 
  { path: 'register', component: RegisterComponent, title: 'Register' }, 
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password' },
  { path: 'reset-password', component: ResetPasswordComponent, title: 'Reset Password' },
  { path: 'userHome', component: HomeComponent, title: 'User', canActivate: [authGuard] }, 
  { path: 'role', component: RoleComponent, title: 'Roles', canActivate: [adminGuard], }, 
  { path: 'adminHome', component: AdminComponent, title: 'Admin', canActivate: [authGuard] },  
  { path: '**', redirectTo: '/login' } 
];
