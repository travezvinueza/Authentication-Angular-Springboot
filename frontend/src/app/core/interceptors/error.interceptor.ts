import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const msgService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400) {
        msgService.add({ severity: 'contrast', summary: 'Error 400', detail: 'Bad request' });
      } else if (error.status === 403) {
        msgService.add({ severity: 'contrast', summary: 'Error 403', detail: 'Forbidden' });
         router.navigate(['/shared/cod404']);
      } else if (error.status === 404) {
        msgService.add({ severity: 'contrast', summary: 'Error 404', detail: 'Not found' });
      } else if (error.status === 500) {
        msgService.add({ severity: 'contrast', summary: 'Error 500', detail: 'Internal server error' });
      } else {
        msgService.add({ severity: 'contrast', summary: `Error ${error.status}`, detail: error.message });
      }
      return throwError(() => new Error(error.message));
    })
  );
};
