import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  userForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly msgService: MessageService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      id: [0],
      username: [''],
      password: [''],
      email: [''],
      imageProfile: [null],
      roles: [[]],
      accountLocked: [false],
    });
  }

  editUser(id: number) {
    this.adminService.getUserById(id).subscribe({
      next: (userData: any) => {
        this.userForm.patchValue(userData);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }

  updateUser() {
    const valoresFormulario = this.userForm.value;
    // Validar formulario
    if (!this.userForm.valid) {
      Object.values(this.userForm.controls).forEach((control) => control.markAsTouched());
      return;
    }

    this.adminService.updateUser(valoresFormulario, this.selectedFile || undefined).subscribe({
      next: () => {
        this.msgService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
        this.userForm.reset();
        this.previewUrl = ''; // Limpiar la vista previa
        this.selectedFile = null; // Limpiar el archivo seleccionado
      },
      error: (err) => {
        console.error('Error en la solicitud:', err);
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario.' });
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

}
