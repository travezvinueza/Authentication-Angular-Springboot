import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userDto = localStorage.getItem('userDto');
  const token = userDto ? JSON.parse(userDto).token : null;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  return next(req);
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
