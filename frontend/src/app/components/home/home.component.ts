import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

 constructor(
     private readonly authService: AuthService,
     private readonly router: Router) {}

  ngOnInit(): void {
    debugger;
    this.authService.startTokenRefresh();
  }

}
