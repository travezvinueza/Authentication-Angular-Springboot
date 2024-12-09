import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.isAdmin();

  if (isAdmin) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Redirige si no tiene permisos
    return false;
  }
};
