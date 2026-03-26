import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Metric } from '../models/metric.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';

export interface MetricEntry extends Metric {
  id?: string;
  category: 'Performance' | 'Availability' | 'Business' | 'Security';
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/metrics`;
  readonly http = inject(HttpClient);

  getMetrics(): Observable<MetricEntry[]> {
    return this.http.get<MetricEntry[]>(this.apiUrl);
  }

  getMetricById(id: string): Observable<MetricEntry> {
    return this.http.get<MetricEntry>(`${this.apiUrl}/${id}`);
  }

  addMetric(metric: MetricEntry): Observable<MetricEntry> {
    return this.http.post<MetricEntry>(this.apiUrl, metric);
  }

  updateMetric(id: string, metric: Partial<MetricEntry>): Observable<MetricEntry> {
    return this.http.put<MetricEntry>(`${this.apiUrl}/${id}`, metric);
  }

  deleteMetric(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
