import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && token) {
        const authService = inject(AuthService);
        return authService.refreshToken().pipe(
          switchMap(newToken => {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(req); // Reintenta la solicitud con el nuevo token
          }),
          catchError(refreshError => {
            console.error('Error al refrescar el token:', refreshError);
            (inject(AuthService).logOut()); 
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};




// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const userDto = localStorage.getItem('userDto');
//   const token = userDto ? JSON.parse(userDto).token : null;
//   const excludedUrls = ['/auth/login', '/auth/register']; // Excluir rutas

//   if (token && !excludedUrls.some((url) => req.url.includes(url))) {
//     req = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` },
//     });
//   }

//   return next(req);
// };
