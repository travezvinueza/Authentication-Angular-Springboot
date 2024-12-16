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

  getAllListRole(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.baseUrl}/list`);
  }

  createRole(roleDto: RoleDto): Observable<RoleDto> {
    return this.http.post<RoleDto>(`${this.baseUrl}/create`, roleDto);
  }

  getRoleById(id: number): Observable<RoleDto> {
    return this.http.get<RoleDto>(`${this.baseUrl}/${id}`);
  }

  updateRole(roleDto: RoleDto): Observable<RoleDto> {
    return this.http.put<RoleDto>(`${this.baseUrl}/update`, roleDto);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
