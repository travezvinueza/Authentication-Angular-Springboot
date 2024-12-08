import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleDto } from '../interfaces/RoleDto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly baseUrl = environment.apiUrl + '/roles';

  constructor(private readonly http: HttpClient) {}

  listRole(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.baseUrl}/list`);
  }

}
