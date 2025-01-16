import { Routes } from "@angular/router";
import { roleGuard } from "../core/guards/role.guard";

export default [

    {
        path: 'dashboard',
        loadComponent: () => import('../pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard',
        canActivate: [roleGuard(['ADMIN'])]
    },

    {
        path: 'home',
        loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home',
        canActivate: [roleGuard(['ADMIN'])]
    },

    {
        path: 'role',
        loadComponent: () => import('../admin/role/role.component').then(m => m.RoleComponent),
        title: 'Roles',
        canActivate: [roleGuard(['ADMIN'])]
    },
    {
        path: 'user-list',
        loadComponent: () => import('../admin/user-list/user-list.component').then(m => m.UserListComponent),
        title: 'List',
        canActivate: [roleGuard(['ADMIN'])]
    },

] as Routes
