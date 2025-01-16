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
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile',
        canActivate: [authGuard]
    },

] as Routes;