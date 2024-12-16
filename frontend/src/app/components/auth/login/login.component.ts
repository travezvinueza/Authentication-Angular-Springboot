import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule, CardModule, InputTextModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  isLogin = true;
  userDetail !: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly msgService: MessageService,
    private readonly router: Router) {}


  ngOnInit(): void {
    this.userDetail = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.userDetail.invalid) {
      this.msgService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa los campos requeridos.' });
      return;
    }

    const { username, password } = this.userDetail.value;

    this.authService.login(username, password).subscribe({
      
      next: (response: any) => {

        // Verifica si la cuenta está bloqueada
      if (response.statusCode === 401 && response.message.includes('bloqueada')) {
        this.msgService.add({ severity: 'error', summary: 'Cuenta Bloqueada', detail: response.message });
        return;
      }
      
        localStorage.setItem('token', response.token);
        localStorage.setItem('roles', JSON.stringify(response.roles));

        const roles = response.roles.map((role: any) => role.roleName);
        if (roles.includes('ADMIN')) {
          this.router.navigate(['/adminHome']);
        } else if (roles.includes('USER')) {
          this.router.navigate(['/userHome']);
        } else {
          console.error('Rol desconocido:', roles);
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas o error en el servidor.' });
      },
    });
  }

  redirectRegister(): void {
    this.router.navigate(['/register']);
  }

  redirectResetPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

}
