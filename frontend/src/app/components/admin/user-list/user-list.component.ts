import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { UserDto } from '../../../interfaces/UserDto';
import { AdminService } from '../../../services/admin.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UserEditComponent } from "../user-edit/user-edit.component";

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
  userDetail!: FormGroup;

  usuariosEditar: any;
  modoOculto: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly msgService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.userDetail = this.formBuilder.group({
      id: [0],
      username: [''],
      password: [''],
      email: [''],
      imageProfile: [null],
      roles: [[]],
      accountLocked: [false],
    });
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

  addUser() {
    const nuevoUsuario: UserDto = {
      id: 0,
      username: this.userDetail.value.username,
      email: this.userDetail.value.email,
      roles: this.userDetail.value.roles || [],
      password: '',
      token: '',
      accountLocked: false,
    };

    this.adminService
      .createUser(nuevoUsuario, this.userDetail.value.imageProfile)
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

  editUser(id: number) {
    this.adminService.getUserById(id).subscribe({
      next: (user: UserDto) => {
        this.userDetail.patchValue(user);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }

  updateUser() {
    const usuarioActualizado: UserDto = {
      id: this.userDetail.value.id,
      username: this.userDetail.value.username,
      email: this.userDetail.value.email,
      roles: this.userDetail.value.roles || [],
      password: '',
      token: '',
      accountLocked: false,
    };

    this.adminService
      .updateUser(usuarioActualizado, this.userDetail.value.imageProfile)
      .subscribe({
        next: () => {
          this.msgService.add({
            severity: 'warn',
            summary: 'Éxito',
            detail: 'Usuario actualizado',
          });
          this.userDetail.reset();
          this.getAllUsers();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar el usuario:', error);
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el usuario',
          });
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
