import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserDto } from '../interfaces/UserDto';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl + '/auth';

  // Usamos BehaviorSubject para mantener el estado de la autenticación.
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  authenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly msService: MessageService) { }

  login(username: string, password: string): Observable<UserDto> {
    const body = { username, password };
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

  forgotPassword(email: string): Observable<UserDto> {
    const params = new HttpParams().set('email', email);
    return this.http.post<UserDto>(`${this.baseUrl}/forgot-password`, null, { params });
  }

  resetPassword(otp: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('otp', otp).set('newPassword', newPassword);
    return this.http.post<any>(`${this.baseUrl}/reset-password`, null, { params });
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/refresh-token`, {}).pipe(
      map(response => response.token),
      tap(newToken => {
        localStorage.setItem('token', newToken);
        this.msService.add({ severity: 'info', summary: 'TOKEN', detail: 'El token se ha actualizado correctamente.' });
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
    const expirationTime = decoded.exp * 1000; // Tiempo de expiración del token en milisegundos
    const timeRemaining = expirationTime - Date.now(); // Calcular el tiempo restante antes de la expiración
    const refreshTime = timeRemaining - 30 * 1000; // Configurar el refresco 30 segundos antes de que expire el token

    if (refreshTime > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe({
          next: () => {
            console.info('Token refrescado automáticamente.');
            this.startTokenRefresh();  // Volver a programar el próximo refresco
          },
          error: () => {
            console.warn('No se pudo refrescar el token automáticamente.');
          },
        });
      }, refreshTime);
    } else {
      console.warn('El tiempo restante es insuficiente para refrescar el token.');
    }
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
    this.authenticatedSubject.next(false);
  }

  getUserImage(): string {
    const imageUrl = localStorage.getItem('imageProfile');
    return imageUrl ?? '';
  }

}
