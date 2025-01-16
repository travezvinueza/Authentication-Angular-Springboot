import { Routes } from "@angular/router";
import { authGuard } from "../core/guards/auth.guard";
import { roleGuard } from "../core/guards/role.guard";

export default [

    {
        path: 'dashboard',
        loadComponent: () => import('../components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard',
        canActivate: [authGuard]
    },

    {
        path: 'profile',
        loadComponent: () => import('../components/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile',
        canActivate: [authGuard]
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

    // {

    //     path: 'dashboard',
    //     loadComponent: () => import('../components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    //     title: 'Dashboard',
    //     canActivate: [authGuard],

    //     children: [
    //         {
    //             path: 'role',
    //             loadComponent: () => import('../admin/role/role.component').then(m => m.RoleComponent),
    //             title: 'Roles',
    //             canActivate: [roleGuard(['ADMIN'])]
    //         },
    //         {
    //             path: 'user-list',
    //             loadComponent: () => import('../admin/user-list/user-list.component').then(m => m.UserListComponent),
    //             title: 'List',
    //             canActivate: [roleGuard(['ADMIN'])]
    //         },
    //         {
    //             path: 'profile',
    //             loadComponent: () => import('../components/profile/profile.component').then(m => m.ProfileComponent),
    //             title: 'Profile',
    //             canActivate: [authGuard]
    //         },
    //     ]
    // },

] as Routes
