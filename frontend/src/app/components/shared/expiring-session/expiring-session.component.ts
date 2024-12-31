import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-expiring-session',
  imports: [CommonModule, ToastModule, RouterModule],
  templateUrl: './expiring-session.component.html',
  styleUrl: './expiring-session.component.css'
})
export class ExpiringSessionComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly msgService: MessageService,
    private readonly router: Router) {}

  ngOnInit(): void {
    this.authService.startTokenRefresh();
  }

  confirm(): void {
    this.authService.refreshToken().subscribe({
      next: () => {
        console.info('Token actualizado correctamente.');
        this.msgService.clear('confirm'); 
        this.authService.startTokenRefresh(); // Vuelve a programar la actualización automática
      },
      error: (err) => {
        console.error('Error al actualizar el token:', err);
        this.authService.logOut();
        this.router.navigate(['/login']);
      },
    });
  }

  cancel(): void {
    this.authService.logOut();
    this.msgService.clear('confirm'); // Limpia el mensaje de confirmación
    this.router.navigate(['/login']); // Redirige al login
  }

}
