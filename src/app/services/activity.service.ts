import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/api/activities';

  constructor(private http: HttpClient) { }

  // Obtenir activitats paginades
  getActivities(page: number = 1, limit: number = 5): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtenir activitats d'un usuari específic
  getActivitiesByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  // Obtenir una activitat per ID
  getActivityById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  // Crear una nova
  createActivity(activityData: any): Observable<any> {
    return this.http.post(this.apiUrl, activityData);
  }

  // Actualizar
  updateActivity(activityId: string, activityData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${activityId}`, activityData);
  }

  // Eliminar
  deleteActivity(activityId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${activityId}`);
  }
}