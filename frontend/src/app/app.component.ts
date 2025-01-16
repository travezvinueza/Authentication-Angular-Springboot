import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { ExpiringSessionComponent } from './shared/expiring-session/expiring-session.component';
import { SidebarService } from './components/sidebar.service';
@Component({
  selector: 'app-root',
  imports: [
    ToastModule,
    RouterModule,
    ExpiringSessionComponent,
    CommonModule, NavbarComponent,
    SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  isLoginRoute: boolean = false;
  private readonly sidebarService = inject(SidebarService);
  isSidebarVisible = this.sidebarService.getSidebarVisibility();
  isAuthenticate: boolean = false;

  private readonly authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    effect(() => {
      this.isAuthenticate = this.authService.isAuthenticated();
      this.ourRouter();
    })

  }
  ngOnInit(): void {
    this.authService.startTokenRefresh();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  ourRouter() {
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.authRoutes.includes(this.router.url);
    });
  }

}
