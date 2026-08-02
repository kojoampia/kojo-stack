import { Injectable, inject } from '@angular/core';
import { Education } from '../models/education.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCache } from './http-cache';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/education`;

  /** Public read-mostly content; shared across subscribers and navigations. */
  private readonly cache = new HttpCache<Education[]>();
  readonly http: HttpClient = inject(HttpClient);

  create(education: Education): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, education).pipe(tap(() => this.cache.invalidate()));
  }

  update(id: string, education: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/${id}`, education).pipe(tap(() => this.cache.invalidate()));
  }

  getById(id: string): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Education[]> {
    return this.cache.read(() => this.http.get<Education[]>(this.apiUrl));
  }

  getByType(type: string): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/type/${type}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache.invalidate()));
  }
}
