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

  constructor(private readonly http: HttpClient) { }

  getAllListUser(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/list`);
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

  lockUser(id: number, locked: boolean): Observable<any> {
    const url = `${this.baseUrl}/${id}/locked`;
    const params = { locked: locked.toString() };
    return this.http.put<any>(url, null, { params });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}