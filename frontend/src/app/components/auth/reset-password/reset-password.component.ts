import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CardModule],
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
      newPassword: ['', [Validators.required]]
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

}
