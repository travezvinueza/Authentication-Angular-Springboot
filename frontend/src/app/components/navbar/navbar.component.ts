import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isAuthenticate = this.authService.isAuthenticated();
  rolesSignal = this.authService.getRolesSignal();
  userImage = this.isAuthenticate ? this.authService.getUserImage() : '';
  notificationCount: number = 5; 


  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    this.authService.logOut();
  }

  redirectToProfile(): void {
    if (this.isAuthenticate)
      this.router.navigate(['/pages/profile']);
  }

}