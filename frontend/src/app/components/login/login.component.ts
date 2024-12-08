import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';

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
    private readonly router: Router) {}


  ngOnInit(): void {
    this.userDetail = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.userDetail.invalid) {
      alert('Por favor, completa los campos requeridos.');
      return;
    }

    const { username, password } = this.userDetail.value;

    this.authService.login(username, password).subscribe({
      
      next: (response) => {
        // Guardar token en localStorage
        localStorage.setItem('token', response.token);

        // Guardar roles como JSON string
        localStorage.setItem('roles', JSON.stringify(response.roles));

        // Redirigir basado en los roles
        const roles = response.roles.map((role) => role.roleName);
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
        alert('Credenciales incorrectas o error en el servidor.');
      },
    });
  }

  redirectRegister(): void {
    this.router.navigate(['/register']);
  }
}
