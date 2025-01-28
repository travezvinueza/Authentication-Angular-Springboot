import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
<<<<<<< Updated upstream:frontend/src/app/components/auth/forgot-password/forgot-password.component.ts
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth.service';
=======
import { AuthService } from '../../core/services/auth.service';
>>>>>>> Stashed changes:frontend/src/app/auth/forgot-password/forgot-password.component.ts
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FloatingConfiguratorComponent } from '../../layout/components/floating-configurator/floating-configurator.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    FloatingConfiguratorComponent,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  
  forgotPasswordForm !: FormGroup;
 

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  forgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid email address',
      });
      return;
    }
  
    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset link sent successfully',
        });
        this.router.navigate(['/reset-password']);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to send password reset link',
        });
      },
    });
  }

<<<<<<< Updated upstream:frontend/src/app/components/auth/forgot-password/forgot-password.component.ts
  redirectLogin(): void {
    this.router.navigate(['/login']);
=======
  hasError(field: string, error: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return control ? control.hasError(error) && (control.dirty || control.touched) : false;
>>>>>>> Stashed changes:frontend/src/app/auth/forgot-password/forgot-password.component.ts
  }

}
