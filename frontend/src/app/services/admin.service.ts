import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../interfaces/UserDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  
  private readonly baseUrl = environment.apiUrl + '/users';

  constructor(private readonly http: HttpClient) {}

  getAllListUser(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/list`);
  }

  createUser(userDto: UserDto, imageProfile: File): Observable<UserDto> {
    const formData = new FormData();
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    formData.append('imageProfile', imageProfile);

    return this.http.post<UserDto>(`${this.baseUrl}/create`, formData);
  }

  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/getById/${id}`);
  }

  updateUser(userDto: UserDto, image?: File): Observable<UserDto> {
    const formData = new FormData();
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    if (image) {
      formData.append('newImage', image);
    }
  
    return this.http.put<UserDto>(`${this.baseUrl}/update`, formData);
  }

   blockUser(id: number): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/${id}/block`, null);
  }

  unblockUser(id: number): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/${id}/unblock`, null);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}