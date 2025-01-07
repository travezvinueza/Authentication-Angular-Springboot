import { Component, effect, OnInit, Signal } from '@angular/core';
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
  userImage: string = '';
  rolesSignal!: Signal<string[]>;  

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {
      effect(() => {
        this.isAuthenticated = this.authService.isAuthenticated();
        this.userImage = this.isAuthenticated ? this.authService.getUserImage() : '';
      });
     }

  ngOnInit(): void {
    this.rolesSignal = this.authService.getRolesSignal();
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.authService.logOut();
    this.isAuthenticated = false;
  }

  redirectToProfile(): void {
    const roles = this.rolesSignal();
    if (roles.includes('ADMIN')) {
      this.router.navigate(['/profile']);
    } else if (roles.includes('USER')) {
      this.router.navigate(['/profile']);
    } else if (roles.includes('CLIENT')) {
      this.router.navigate(['/profile']);
    } else if (roles.includes('TEACHER')) {
      this.router.navigate(['/profile']);
    } else {
      console.error('Rol no reconocido o no autenticado.');
    }
  }

}