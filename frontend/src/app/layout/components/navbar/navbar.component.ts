import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '../layout.service';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../../core/services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, StyleClassModule, ConfiguratorComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  public readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  items!: MenuItem[];
  isAuthenticate = this.authService.isAuthenticated();
  rolesSignal = this.authService.getRolesSignal();
  userImage = this.isAuthenticate ? this.authService.getUserImage() : '';
  messageCount: number = 5;

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  logout(): void {
    this.authService.logOut();
  }

  redirectToProfile(): void {
    if (this.isAuthenticate)
      this.router.navigate(['/pages/profile']);
  }

}