import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../interfaces/UserDto';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

declare let $: any;

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  users: UserDto[] = [];
  userDetail!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly msgService: MessageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.userDetail = this.formBuilder.group({
      id: [0],
      username: [''],
      password: [''],
      email: [''],
      imageProfile: [null],
      roles: [[]],
    });
  }

  //metodo para darle movimiento al modal
  ngAfterViewInit() {
    $('.modal-dialog').draggable({
      handle: '.modal-header',
    });
  }

  getAllUsers() {
    this.userService.getAllListUser().subscribe({
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
    };

    this.userService
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
    this.userService.getUserById(id).subscribe({
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
      token: '', // También puede estar vacío si no se usa el token
    };

    this.userService
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

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
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
}
