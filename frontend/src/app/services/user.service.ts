import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  getPendingCustomers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users/pending-customers`);
  }

  getPendingAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/super-admin/users/pending-admins`);
  }

  approveUser(userId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users/${userId}/approve`, {});
  }

  approveAdmin(userId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/super-admin/users/${userId}/approve`, {});
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }

  // Super Admin methods
  deleteSuperAdminUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/super-admin/users/${userId}`, { responseType: 'text' as 'json' });
  }

  getAllUsersSuperAdmin(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/super-admin/users`);
  }
}
