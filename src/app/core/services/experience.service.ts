import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Experience } from '../models/experience.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';


@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/experiences`;
  readonly http = inject(HttpClient);

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.apiUrl);
  }

  getExperienceById(id: string): Observable<Experience | undefined> {
    return this.http.get<Experience>(`${this.apiUrl}/${id}`);
  }

  createExperience(experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(this.apiUrl, experience);
  }

  updateExperience(id: string, experience: Experience): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/${id}`, experience);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
