import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';
import { tap } from 'rxjs/operators';
import { HttpCache } from './http-cache';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/projects`;

  /** Public read-mostly content; shared across subscribers and navigations. */
  private readonly cache = new HttpCache<Project[]>();
  readonly http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.cache.read(() => this.http.get<Project[]>(this.apiUrl));
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(tap(() => this.cache.invalidate()));
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project).pipe(tap(() => this.cache.invalidate()));
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache.invalidate()));
  }
}
