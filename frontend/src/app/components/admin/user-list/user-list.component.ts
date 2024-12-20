import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { UserDto } from '../../../interfaces/UserDto';
import { AdminService } from '../../../services/admin.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UserEditComponent } from "../user-edit/user-edit.component";
import { RoleService } from '../../../services/role.service';
import { RoleDto } from '../../../interfaces/RoleDto';

declare let $: any;

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule,
    UserEditComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: UserDto[] = [];
  roles: RoleDto[] = [];
  userDetail!: FormGroup;

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null

  usuariosEditar: any;
  modoOculto: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly roleService: RoleService,
    private readonly msgService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.userDetail = this.formBuilder.group({
      id: [0],
      username: [''],
      password: ['',[Validators.required, Validators.minLength(6)]],
      email: [''],
      imageUrl: [null],
      roles2: [[]],
      locked: [false],
    });
    this.getAllRoles();
  }

  //metodo para darle movimiento al modal
  ngAfterViewInit() {
    $('.modal-dialog').draggable({
      handle: '.modal-header',
    });
  }

  getAllUsers() {
    this.adminService.getAllListUser().subscribe({
      next: (data: any) => (this.users = data),
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  getAllRoles() {
    this.roleService.getAllListRole().subscribe({
      next: (data: any) => (this.roles = data),
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  addUser() {
    const newUser = this.userDetail.value;

    this.adminService.createUser(newUser, this.selectedFile || undefined)
      .subscribe({
        next: () => {
          this.msgService.add({
            severity: 'info',
            summary: 'Éxito',
            detail: 'Usuario creado exitosamente',
          });
          this.userDetail.reset();
          this.getAllUsers();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        },
      });
  }

  blockUser(id: number) {
    this.adminService.blockUser(id).subscribe({
      next: () => {
        this.msgService.add({
          severity: 'info',
          summary: 'Éxito',
          detail: 'Usuario bloqueado exitosamente.',
        });
        this.getAllUsers();
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  unblockUser(id: number) {
    this.adminService.unblockUser(id).subscribe({
      next: () => {
        this.msgService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario desbloqueado exitosamente.',
        });
        this.getAllUsers();
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  deleteUser(id: number) {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.msgService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario eliminado exitosamente.',
        });
        this.getAllUsers();
      },
      error: (error: HttpErrorResponse) => console.error(error),
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

  toggleModoEdicion(user: any) {
    this.usuariosEditar = user;
    this.editarModoOculto()
    console.log("algoooo*", this.usuariosEditar);
  }

  editarModoOculto() {
    this.modoOculto = !this.modoOculto;
    this.getAllUsers();
  }

}
