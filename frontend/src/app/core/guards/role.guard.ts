import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRoles: string[]): CanActivateFn => {

  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Obtiene los roles actuales del usuario
    const userRoles = authService.getRolesSignal()();

    // Verifica si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (hasRole) {
      return true; // Permitir acceso si el usuario tiene al menos un rol
    }

    // Redirige a una página de "No autorizado" o a otra página específica
    router.navigate(['/unauthorized']);
    return false;
  };
};
