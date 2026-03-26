import { Injectable, inject } from '@angular/core';
import { Education } from '../models/education.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/education`;
  readonly http: HttpClient = inject(HttpClient);

  create(education: Education): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, education);
  }

  update(id: string, education: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/${id}`, education);
  }

  getById(id: string): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }

  getByType(type: string): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/type/${type}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
