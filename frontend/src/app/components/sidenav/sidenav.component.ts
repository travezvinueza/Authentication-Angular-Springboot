import { Component, inject } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserHasRoleDirective } from '../../core/directives/user-has-role.directive';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterModule, UserHasRoleDirective],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly authService = inject(AuthService);

  isSidebarVisible = this.sidebarService.getSidebarVisibility();
  isAuthenticate = this.authService.isAuthenticated();
  rolesSignal = this.authService.getRolesSignal();

  toggleSidebar() {
    this.sidebarService.toggleSidebar(); 
  }

  logout(): void {
    this.authService.logOut();
  }

}