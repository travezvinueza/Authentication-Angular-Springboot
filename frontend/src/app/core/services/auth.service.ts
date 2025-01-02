import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserDto } from '../interfaces/UserDto';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl + '/auth';
  private refreshTimeout: any;

  // Usamos BehaviorSubject para mantener el estado de la autenticación.
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  authenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly msService: MessageService) { }

  login(email: string, password: string): Observable<UserDto> {
    const body = { email, password };
    return this.http.post<UserDto>(`${this.baseUrl}/login`, body).pipe(
      tap((user: UserDto) => {
        localStorage.setItem('token', user.token);
        localStorage.setItem('imageProfile', user.imageProfile ?? '');
        this.authenticatedSubject.next(true);
      })
    );
  }

  registerUser(userDto: UserDto, image?: File): Observable<UserDto> {
    const formData = new FormData();
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    formData.append('imageProfile', image ?? '');
    return this.http.post<UserDto>(`${this.baseUrl}/register`, formData);
  }

  forgotPassword(email: string): Observable<any> {
    const request = { email };
    return this.http.post<any>(`${this.baseUrl}/forget-password`, request);
  }

  resetPassword(otp: string, newPassword: string): Observable<any> {
    const request = { otp, newPassword };
    return this.http.post<any>(`${this.baseUrl}/reset-password`, request);
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/refresh-token`, {}).pipe(
      map(response => response.token),
      tap(newToken => {
        localStorage.setItem('token', newToken);
        this.msService.add({ severity: 'contrast', summary: 'TOKEN', detail: 'El token se ha actualizado correctamente.' });
      }),
      catchError(error => {
        this.msService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el token.' });
        return throwError(() => error);
      })
    );
  }

  startTokenRefresh(): void {
    const decoded = this.getDecodedToken();
    if (!decoded?.exp) {
      console.warn('Token inválido o sin información de expiración.');
      return;
    }
  
    const expirationTime = decoded.exp * 1000; // Tiempo de expiración en milisegundos
    const refreshTime = expirationTime - Date.now() - 1 * 60 * 1000; 
  
    if (refreshTime > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.showConfirmation();
      }, refreshTime);
    } else {
      console.warn('El tiempo restante es insuficiente para refrescar el token.');
    }
  }
  
  showConfirmation(): void {
    this.msService.clear('confirm');
    this.msService.add({
      key: 'confirm',
      sticky: true,
      severity: 'contrast',
      summary: 'AUTENTICACIÓN',
      detail: 'La Sesion esta a punto de expirar ¿Quieres permanecer en la aplicación?',
    });
  }

  /** Decodifica el token JWT */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  /** Verifica si el token ha expirado */
  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    const expiration = decoded?.exp ? decoded.exp * 1000 : 0;
    return Date.now() > expiration;
  }

  /** Obtiene el token decodificado */
  private getDecodedToken(): any {
    const token = localStorage.getItem('token');
    return token ? this.decodeToken(token) : null;
  }

  /** Verifica si el usuario tiene un rol específico */
  hasRole(role: string): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.roles?.includes(role) ?? false;
  }

  /** Obtiene los roles del usuario */
  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.roles || [];
  }

  /** Verifica si el usuario está autenticado */
  isAuthenticated(): boolean {
    return !this.isTokenExpired();
  }

  isAuthenticatedAdmin(): boolean {
    return this.isAuthenticated() && this.hasRole('ADMIN');
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated() && this.hasRole('USER');
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('imageProfile');
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout); // Detener el ciclo de refresco
      this.refreshTimeout = null; // Limpiar la referencia
    }
    this.authenticatedSubject.next(false);
  }

  getUserImage(): string {
    const imageUrl = localStorage.getItem('imageProfile');
    return imageUrl ?? '';
  }

}
