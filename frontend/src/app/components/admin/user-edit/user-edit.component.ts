import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { AdminService } from '../../../services/admin.service';
import { MessageService } from 'primeng/api';
import { RoleService } from '../../../services/role.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleDto } from '../../../interfaces/RoleDto';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, FormsModule, InputTextModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {

  @Input() usuariosEditar: any;
  @Output() modoOculto = new EventEmitter();
  
  userForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null
  roles: RoleDto[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly roleService: RoleService,
    private readonly msgService: MessageService,
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      id: [0],
      username: [''],
      email: [''],
      password: [''],
      roles: [[]],
      imageProfile: [null],
      accountLocked: [false],
    });

    this.getAllRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuariosEditar'] && this.usuariosEditar) {
      this.userForm.patchValue({...this.usuariosEditar, imageProfile: null, });
      this.previewUrl = this.usuariosEditar.imageProfile;
    }
    console.log("onchange", this.usuariosEditar);
  }

  getAllRoles() {
    this.roleService.getAllListRole().subscribe({
      next: (data: any) => (this.roles = data),
      error: (error: HttpErrorResponse) => console.error(error),
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
        this.modoOculto.emit();
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
