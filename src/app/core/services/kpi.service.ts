import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Kpi } from '../models/kpi.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/kpis`;
  readonly http = inject(HttpClient);

  getAll(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(this.apiUrl);
  }

  getById(id: string): Observable<Kpi> {
    return this.http.get<Kpi>(`${this.apiUrl}/${id}`);
  }

  create(kpi: Kpi): Observable<Kpi> {
    return this.http.post<Kpi>(this.apiUrl, kpi);
  }

  update(id: string, kpi: Partial<Kpi>): Observable<Kpi> {
    return this.http.put<Kpi>(`${this.apiUrl}/${id}`, kpi);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
