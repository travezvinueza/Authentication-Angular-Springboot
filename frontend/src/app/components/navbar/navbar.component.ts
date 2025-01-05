import { Component, OnInit, Signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserHasRoleDirective } from '../../shared/directives/user-has-role.directive';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, RouterLink, UserHasRoleDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  collapsed = true;
  isAuthenticated: boolean = false;
  private readonly authSubscription: any;
  isAdmin: boolean = false;
  isUser: boolean = false;
  userImage: string = '';
  rolesSignal!: Signal<string[]>;  // Signal para los roles

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.rolesSignal = this.authService.getRolesSignal();

    // Actualizar autenticación y roles al inicializar
    this.isAuthenticated = this.authService.isAuthenticated();
    this.updateNavbarView();
    this.userImage = this.isAuthenticated ? this.authService.getUserImage() : '';
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  private updateNavbarView(): void {
    const roles = this.rolesSignal();  // Obtener los roles actuales
    this.isAdmin = roles.includes('ADMIN');
    this.isUser = roles.includes('USER');
  }

  logout(): void {
    this.authService.updateRolesFromToken("");
    this.authService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
  }

  redirectToProfile(): void {
    if (this.isAdmin || this.isUser) {
      this.router.navigate(['/profile']);
    } else {
      console.error('Rol no reconocido o no autenticado.');
    }
  }

}