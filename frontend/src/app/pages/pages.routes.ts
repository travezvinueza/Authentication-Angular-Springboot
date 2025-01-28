import { Routes } from "@angular/router";
import { authGuard } from "../core/guards/auth.guard";

export default [

    {
        path: 'home',
        loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home',
        canActivate: [authGuard]
    },
    {
        path: 'crud',
        loadComponent: () => import('../pages/crud/crud').then(m => m.Crud),
        title: 'CRUD',
        canActivate: [authGuard]
    },

    // {
    //     path: 'landing',
    //     loadComponent: () => import('../pages/landing/landing').then(m => m.Landing),
    //     title: 'Landing',
    //     canActivate: [authGuard]
    // },

    {
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile',
        canActivate: [authGuard]
    },

] as Routes;