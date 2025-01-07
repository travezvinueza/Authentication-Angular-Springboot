import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRoles: string[]): CanActivateFn => {

  return () => {
    const userRoles = (inject(AuthService)).getRolesSignal()();
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (hasRole) {
      return true;
    }

    inject(Router).navigate(['/shared/cod404']);
    return false;
  };
};
