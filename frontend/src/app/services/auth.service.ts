import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDto } from '../interfaces/UserDto';
import { environment } from '../../environments/environment';

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

  constructor(private readonly http: HttpClient) { }

  login(username: string, password: string): Observable<UserDto> {
    const body = { username, password };
    return this.http.post<UserDto>(`${this.baseUrl}/login`, body).pipe(
      tap((user: UserDto) => {
        localStorage.setItem('token', user.token);
        localStorage.setItem('roles', JSON.stringify(user.roles));
        this.authenticatedSubject.next(true);
      })
    );
  }

  registerUser(userDto: UserDto, imageProfile: File): Observable<UserDto> {
    const formData = new FormData();
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    formData.append('imageProfile', imageProfile);
    return this.http.post<UserDto>(`${this.baseUrl}/register`, formData);
  }

  forgotPassword(email: string): Observable<UserDto> {
    const params = new HttpParams().set('email', email);
    return this.http.post<UserDto>(`${this.baseUrl}/forgot-password`, null, { params });
  }

  resetPassword(otp: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('otp', otp)
      .set('newPassword', newPassword);
    return this.http.post<any>(`${this.baseUrl}/reset-password`, null, { params });
  }

  /** Métodos de autenticación */

  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
    }
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.some((role) => role.roleName === 'ADMIN');
  }

  isUser(): boolean {
    const roles = this.getRoles();
    return roles.some((role) => role.roleName === 'USER');
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getRoles(): { id: number; roleName: string }[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }
}
