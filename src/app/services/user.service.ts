import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  updateUser(userId: number, userData: any): Observable<any>  {
      throw new Error('Method not implemented.');
  }
  deleteUser(userId: number): Observable<any> {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/api/users'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  getUsers(page: number = 1, limit: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  // Otros métodos que necesites
}