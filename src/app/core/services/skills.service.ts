import { Injectable, inject } from '@angular/core';
import { TechSkill } from '../models/tech-skill.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/skills`;
  readonly http: HttpClient = inject(HttpClient);

  createSkill(skill: TechSkill): Observable<TechSkill> {
    return this.http.post<TechSkill>(this.apiUrl, skill);
  }

  updateSkill(id: string, skill: TechSkill): Observable<TechSkill> {
    return this.http.put<TechSkill>(`${this.apiUrl}/${id}`, skill);
  }

  getSkillById(id: string): Observable<TechSkill> {
    return this.http.get<TechSkill>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<TechSkill[]> {
    return this.http.get<TechSkill[]>(this.apiUrl);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
