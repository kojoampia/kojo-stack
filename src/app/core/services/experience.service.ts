import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Experience } from '../models/experience.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';
import { tap } from 'rxjs/operators';
import { HttpCache } from './http-cache';


@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/experiences`;

  /** Public read-mostly content; shared across subscribers and navigations. */
  private readonly cache = new HttpCache<Experience[]>();
  readonly http = inject(HttpClient);

  getExperiences(): Observable<Experience[]> {
    return this.cache.read(() => this.http.get<Experience[]>(this.apiUrl));
  }

  getExperienceById(id: string): Observable<Experience | undefined> {
    return this.http.get<Experience>(`${this.apiUrl}/${id}`);
  }

  createExperience(experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(this.apiUrl, experience).pipe(tap(() => this.cache.invalidate()));
  }

  updateExperience(id: string, experience: Experience): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/${id}`, experience).pipe(tap(() => this.cache.invalidate()));
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache.invalidate()));
  }
}
