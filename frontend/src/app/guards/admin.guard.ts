import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAuthenticatedAdmin()) {
    return true;
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
