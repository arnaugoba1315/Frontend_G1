import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // Obtener usuarios paginados
  getUsers(page: number = 1, limit: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // Actualizar un usuario existente
  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  // Eliminar un usuario
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}