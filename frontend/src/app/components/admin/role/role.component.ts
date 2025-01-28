import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
<<<<<<< Updated upstream:frontend/src/app/components/admin/role/role.component.ts
import { RoleDto } from '../../../interfaces/RoleDto';
import { RoleService } from '../../../services/role.service';

declare let $: any;
=======
import { RoleDto } from '../../core/interfaces/RoleDto';
import { RoleService } from '../../core/services/role.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
>>>>>>> Stashed changes:frontend/src/app/admin/role/role.component.ts

@Component({
  selector: 'app-role',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ToolbarModule,
    TextareaModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent implements OnInit {

  roleDialog: boolean = false;

  role!: RoleDto;

  roles: RoleDto[] = [];

   @ViewChild('dt') dt!: Table;

  submitted: boolean = false;

  rowsPerPageOptions: number[] = [5, 10, 20];

  roleForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly roleService: RoleService,
    private readonly confirmationService: ConfirmationService,
    private readonly msgService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.roleForm = this.formBuilder.group({
      id: [0],
      roleName: ['',[Validators.required]],
    });
  }

  exportCSV() {
    this.dt.exportCSV();
}

getAllRoles() {
  this.roleService.getAllListRole().subscribe({
    next: (data: any) => (this.roles = data),
    error: (error: HttpErrorResponse) => console.error(error),
  });
}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

openNew() {
this.roleForm.reset();
  this.submitted = false;
  this.roleDialog = true;
}

editRole(role: RoleDto) {
  this.roleForm.patchValue({ ...role });
  this.roleDialog = true;
}

  deleteRole(role: RoleDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.roleName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.deleteRole(role.id).subscribe((data) => {
          this.getAllRoles();
          this.msgService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol eliminado exitosamente.',
          });
        });
      }
    });
  }

  hideDialog() {
    this.submitted = false;
  }

  createId(): string {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  saveRole() {

    if (this.roleForm.invalid) {
      this.isTouched();
      return;
    }

    if (this.roleForm.get('id')?.value) {
      this.roleService.updateRole(this.roleForm.value as RoleDto).subscribe((data) => {
        this.role = data;
        this.getAllRoles();
        this.msgService.add({ severity: 'success', summary: 'Role Updated', detail: 'Role ' + this.role.roleName + ' updated successfully' });
      })

    } else {
      console.log(this.roleForm.value);
      this.roleService.createRole(this.roleForm.value).subscribe({
        next: () => {
          this.getAllRoles();
          this.msgService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol creado exitosamente.',
          });
          this.roleForm.reset();

        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el rol', });
        },
      });
    }
    this.roleDialog = false;
  }

  isTouched() {
    Object.values(this.roleForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  isRequire(controlName: string, errorType: string) {
    const control = this.roleForm.get(controlName);
    return control?.invalid && control.errors?.[errorType] && (control.touched || control.dirty);
  }

  isInvalid(controlName: string): boolean {
    const control = this.roleForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

 

  // addRole() {
  //   this.roleService.createRole(this.roleDetail.value).subscribe({
  //     next: () => {
  //       this.getAllRoles();
  //       this.msgService.add({
  //         severity: 'success',
  //         summary: 'Éxito',
  //         detail: 'Rol creado exitosamente.',
  //       });
  //       this.roleDetail.reset();
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error(error);
  //       this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el rol', });
  //     },
  //   });
  // }

  // editRole(id: number) {
  //   this.roleService.getRoleById(id).subscribe({
  //     next: (role: RoleDto) => {
  //       this.roleDetail.patchValue(role);
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.error(err);
  //     },
  //   });
  // }

  // updateRole() {
  //   const roleActualizado: RoleDto = {
  //     id: this.roleDetail.value.id,
  //     roleName: this.roleDetail.value.roleName,
  //   };
  //   this.roleService.updateRole(roleActualizado).subscribe({
  //     next: () => {
  //       this.getAllRoles();
  //       this.msgService.add({
  //         severity: 'success',
  //         summary: 'Éxito',
  //         detail: 'Rol actualizado exitosamente.',
  //       });
  //       this.roleDetail.reset();
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error(error);
  //       this.msgService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Error al actualizar el rol',
  //       });
  //     },
  //   });
  // }

  // deleteRole(id: number) {
  //   this.roleService.deleteRole(id).subscribe({
  //     next: () => {
  //       this.getAllRoles();
  //       this.msgService.add({
  //         severity: 'success',
  //         summary: 'Éxito',
  //         detail: 'Rol eliminado exitosamente.',
  //       });
  //     },
  //     error: (error: HttpErrorResponse) => console.error(error),
  //   });
  // }

}
