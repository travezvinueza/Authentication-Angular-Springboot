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
        localStorage.setItem('userDto', JSON.stringify(user));
        this.authenticatedSubject.next(true);
      })
    );
  }

  registerUser(userDto: UserDto, image?: File): Observable<UserDto> {
    const formData = new FormData();
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    if (image) {
      formData.append('imageProfile', image);
    }
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
    localStorage.removeItem('userDto');
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getUserDto();
  }

  isAdmin(): boolean {
    return this.getUserDto()?.roles?.some((role: any) => role.roleName === 'ADMIN') || false;
  }

  isUser(): boolean {
    return this.getUserDto()?.roles?.some((role: any) => role.roleName === 'USER') || false;
  }

  getUserImage(): string {
    return this.getUserDto()?.imageProfile ?? '';
  }

  getRoles(): string[] {
    const userDto = this.getUserDto();
    return userDto?.roles?.map((role: any) => role.roleName) || [];
  }

  private getUserDto(): UserDto | null {
    const userDto = localStorage.getItem('userDto');
    return userDto ? JSON.parse(userDto) : null;
  }
  
}
