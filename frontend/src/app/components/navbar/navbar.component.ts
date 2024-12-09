import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

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

  constructor(private readonly authService: AuthService){}

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.isAdmin = this.authService.isAdmin();
      this.isUser = !this.isAdmin; // Un usuario regular no es administrador
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

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}