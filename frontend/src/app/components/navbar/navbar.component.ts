import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  collapsed = true;
  isAuthenticated:boolean = false;
  isAdmin:boolean = false;
  isUser:boolean = false;
  private authSubscription: any;
  userImage: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router){}

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.isAdmin = this.authService.isAdmin();
      this.isUser = !this.isAdmin; 
      if (this.isAuthenticated) {
         this.userImage = this.authService.getUserImage();
      }
    });
    // Verificar roles iniciales
    this.isAdmin = this.authService.isAdmin();
    this.isUser = !this.isAdmin;
  }

  logout(): void {
    this.authService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
  }

  redirectToProfile(): void {
    const roles = this.authService.getRoles();
    if (roles.includes('ADMIN')) {
      this.router.navigate(['/profile']);
    } else if (roles.includes('USER')) {
      this.router.navigate(['/profile']);
    } else {
      console.error('Rol no reconocido o no autenticado.');
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}