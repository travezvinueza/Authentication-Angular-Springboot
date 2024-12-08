import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../interfaces/UserDto';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<UserDto> {
    const body = { username, password };
    return this.http.post<UserDto>(`${this.baseUrl}/login`, body);
  }

  registerUser(userDto: UserDto, imageProfile: File): Observable<UserDto> {
    const token = this.getToken(); 
    const formData = new FormData();
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    formData.append('imageProfile', imageProfile);
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.post<UserDto>(`${this.baseUrl}/register`, formData, { headers });
  }
  
  /** Métodos de autenticación */

  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  isUser(): boolean {
    const role = this.getRole();
    return role === 'USER';
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getRole(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('roles');
    }
    return null;
  }
}