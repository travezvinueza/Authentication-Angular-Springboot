import { Directive, effect, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appUserHasRole]'
})
export class UserHasRoleDirective {
  @Input('appUserHasRole') roles: string[] | string = [];

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly authService: AuthService
  ) {
    effect(() =>
      this.updateView());
  }

  private updateView(): void {
    const userRoles = this.authService.getRolesSignal()(); // Obtener los roles actuales
    const requiredRoles = Array.isArray(this.roles) ? this.roles : [this.roles]; // Normalizar entrada

    const hasAccess = requiredRoles.some(role => userRoles.includes(role));

    if (hasAccess) {
      this.viewContainerRef.createEmbeddedView(this.templateRef); // Mostrar contenido
    } else {
      this.viewContainerRef.clear(); // Ocultar contenido
    }
  }
}
