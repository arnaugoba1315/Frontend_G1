import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "https://reqres.in/api/";  
  constructor(private http: HttpClient) { }
  
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + "login/", credentials);
  }

  register(credentials: { email: string; password: string; age: number; }): Observable<any> {
    return this.http.post(this.apiUrl + "register/", credentials);
  }
}