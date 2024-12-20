import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { RoleDto } from '../../../interfaces/RoleDto';
import { RoleService } from '../../../services/role.service';

declare let $: any;

@Component({
  selector: 'app-role',
  imports: [ 
    CommonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule,
   ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent implements OnInit {
  roles: RoleDto[] = [];
  roleDetail!: FormGroup;
  filterRoles: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly roleService: RoleService,
    private readonly msgService: MessageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAllRoles();
    this.roleDetail = this.formBuilder.group({
      id: [0],
      roleName: [''],
    });
  }

  ngAfterViewInit() {
    $('.modal-dialog').draggable({
      handle: '.modal-header',
    });
  }

  buscar(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterRoles = this.roles.filter( (role: any) =>
      role.id.toString().includes(input.value.toLowerCase()) ||
      role.roleName.toLowerCase().includes(input.value.toLowerCase())
    );
  }

  getAllRoles() {
    this.roleService.getAllListRole().subscribe({
      next: (data: any) => {
        this.roles = data;
        this.filterRoles = data;
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  addRole() {
    this.roleService.createRole(this.roleDetail.value).subscribe({
      next: () => {
        this.getAllRoles();
        this.msgService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol creado exitosamente.',
        });
        this.roleDetail.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.msgService.add({severity: 'error', summary: 'Error', detail: 'Error al crear el rol',});
      },
    });
  }

  editRole(id: number) {
    this.roleService.getRoleById(id).subscribe({
      next: (role: RoleDto) => {
        this.roleDetail.patchValue(role);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }

  updateRole() {
    const roleActualizado: RoleDto = {
      id: this.roleDetail.value.id,
      roleName: this.roleDetail.value.roleName,
    };
    this.roleService.updateRole(roleActualizado).subscribe({
      next: () => {
        this.getAllRoles();
        this.msgService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol actualizado exitosamente.',
        });
        this.roleDetail.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el rol',
        });
      },
    });
  }

  deleteRole(id: number) {
    this.roleService.deleteRole(id).subscribe({
      next: () => {
        this.getAllRoles();
        this.msgService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol eliminado exitosamente.',
        });
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }
  
}
