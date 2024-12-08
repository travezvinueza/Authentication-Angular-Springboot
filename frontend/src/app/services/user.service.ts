import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../interfaces/UserDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environment.apiUrl + '/users';

  constructor(private readonly http: HttpClient) {}

  getAllListUser(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/list`);
  }

}