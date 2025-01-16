import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    JsonPipe,
    FormsModule,
    DialogModule,
    ButtonModule, 
    CardModule,
    InputTextModule, 
    ReactiveFormsModule,
    RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  imageUrl: string = '/img/angular.jpg';
  visible: boolean = false;
  userDetail !: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly msgService: MessageService,
    private readonly router: Router) { }


  ngOnInit(): void {
    this.userDetail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Recuperar los datos del sessionStorage
    const email = sessionStorage.getItem('email');
    const password = sessionStorage.getItem('password');

    if (email && password) {
      this.userDetail.patchValue({
        email: email,
        password: password,
      });
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('password');
    }
  }

  showDialog() {
    this.visible = true;
  }

  login(): void {
    if (this.userDetail.invalid) {
      this.msgService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa los campos requeridos.' });
      return;
    }

    const { email, password } = this.userDetail.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        const roles = this.authService.getRolesSignal()();
        if (roles.includes('ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else if (roles) {
          this.router.navigate(['/pages/home']);
        } else {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Rol no encontrado' });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', err);
        if (err.status === 401 && err.error?.message.includes('bloqueada')) {
          this.msgService.add({ severity: 'error', summary: 'Cuenta Bloqueada', detail: err.error.message });
        } else if (err.status === 401) {
          this.msgService.add({ severity: 'error', summary: 'Credenciales inválidas', detail: err.error.message });
        } else if (err.status === 0) {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar al servidor.' });
        } else {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error en el servidor.' });
        }
      },
    });
  }

  redirectRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  redirectResetPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

}
