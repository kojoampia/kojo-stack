import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Kpi } from '../models/kpi.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';
import { tap } from 'rxjs/operators';
import { HttpCache } from './http-cache';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/kpis`;

  /** Public read-mostly content; shared across subscribers and navigations. */
  private readonly cache = new HttpCache<Kpi[]>();
  readonly http = inject(HttpClient);

  getAll(): Observable<Kpi[]> {
    return this.cache.read(() => this.http.get<Kpi[]>(this.apiUrl));
  }

  getById(id: string): Observable<Kpi> {
    return this.http.get<Kpi>(`${this.apiUrl}/${id}`);
  }

  create(kpi: Kpi): Observable<Kpi> {
    return this.http.post<Kpi>(this.apiUrl, kpi).pipe(tap(() => this.cache.invalidate()));
  }

  update(id: string, kpi: Partial<Kpi>): Observable<Kpi> {
    return this.http.put<Kpi>(`${this.apiUrl}/${id}`, kpi).pipe(tap(() => this.cache.invalidate()));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache.invalidate()));
  }
}
