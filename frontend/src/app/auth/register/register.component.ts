import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDto } from '../../core/interfaces/UserDto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  formUser !: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = environment.defaultUserImage;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly msgService: MessageService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      imageProfile: [null],
      // roles: [[], Validators.required],
    });
  }

  // Método para verificar si un campo tiene errores y si fue tocado
  hasError(field: string, error: string): boolean {
    const control = this.formUser.get(field);
    return control ? control.hasError(error) && (control.dirty || control.touched) : false;
  }

  register(): void {
    if (this.formUser.invalid) {
      this.msgService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    const userDto: UserDto = this.formUser.value;

    this.authService.registerUser(userDto, this.selectedFile || undefined).subscribe({
      next: () => {
        this.msgService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado exitosamente.' });
        // Almacenamos los datos en sessionStorage
        sessionStorage.setItem('email', userDto.email);
        sessionStorage.setItem('password', userDto.password);
        this.router.navigate(['/auth/login']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error.error);
        const errorMessage = error.error.message || 'Error al procesar la solicitud.';
        this.msgService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      },
    });
  }

  showPreview() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.showPreview();
  }

  redirectLogin(): void {
    this.router.navigate(['/auth/login']);
  }

}