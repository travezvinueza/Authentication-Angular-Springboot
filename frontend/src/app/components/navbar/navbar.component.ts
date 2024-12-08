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

  constructor(private readonly authService: AuthService){}

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  isAuthenticated:boolean = false;
  isAdmin:boolean = false;
  isUser:boolean = false;

  ngOnInit(): void {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.isAdmin = this.authService.isAdmin();
      this.isUser = this.authService.isUser();
  }

  logout():void{
    debugger
    this.authService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
  }

}