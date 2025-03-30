import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api/";
  constructor(private http: HttpClient) { }
  
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + "users/login", credentials);
  }

  register(credentials: { username: string; email: string; password: string; }): Observable<any> {
    return this.http.post(this.apiUrl + "users", credentials);
  }
}
