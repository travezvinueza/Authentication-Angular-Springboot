import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
<<<<<<< Updated upstream:frontend/src/app/components/auth/reset-password/reset-password.component.ts
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth.service';
=======
import { AuthService } from '../../core/services/auth.service';
>>>>>>> Stashed changes:frontend/src/app/auth/reset-password/reset-password.component.ts
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatingConfiguratorComponent } from '../../layout/components/floating-configurator/floating-configurator.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, FloatingConfiguratorComponent, ButtonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required], Validators.minLength(6)],
    })
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const { otp, newPassword } = this.resetPasswordForm.value;
      this.authService.resetPassword(otp, newPassword).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password reset successfully!',
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'An error occurred!',
          });
        },
      });
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.resetPasswordForm.get(field);
    return control ? control.hasError(error) && (control.dirty || control.touched) : false;
  }

}
