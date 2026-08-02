import { Injectable, inject } from '@angular/core';
import { TechSkill } from '../models/tech-skill.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCache } from './http-cache';


@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/skills`;

  /** Public read-mostly content; shared across subscribers and navigations. */
  private readonly cache = new HttpCache<TechSkill[]>();
  readonly http: HttpClient = inject(HttpClient);

  createSkill(skill: TechSkill): Observable<TechSkill> {
    return this.http.post<TechSkill>(this.apiUrl, skill).pipe(tap(() => this.cache.invalidate()));
  }

  updateSkill(id: string, skill: TechSkill): Observable<TechSkill> {
    return this.http.put<TechSkill>(`${this.apiUrl}/${id}`, skill).pipe(tap(() => this.cache.invalidate()));
  }

  getSkillById(id: string): Observable<TechSkill> {
    return this.http.get<TechSkill>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<TechSkill[]> {
    return this.cache.read(() => this.http.get<TechSkill[]>(this.apiUrl));
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache.invalidate()));
  }
}
