import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Metric } from '../models/metric.model';

export interface MetricEntry extends Metric {
  id?: string;
  category: 'Performance' | 'Availability' | 'Business' | 'Security';
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricService {
  private metrics$ = new BehaviorSubject<MetricEntry[]>([
    {
      id: 'metric-1',
      label: 'API Availability',
      value: '99.95%',
      trend: 'up',
      category: 'Availability',
      description: 'Overall API uptime across all services'
    },
    {
      id: 'metric-2',
      label: 'Response Latency',
      value: '<50ms',
      trend: 'stable',
      category: 'Performance',
      description: 'Average API response time'
    },
    {
      id: 'metric-3',
      label: 'Deploys/Week',
      value: '15+',
      trend: 'up',
      category: 'Business',
      description: 'Weekly deployment frequency'
    },
    {
      id: 'metric-4',
      label: 'Security Score',
      value: 'A+',
      trend: 'stable',
      category: 'Security',
      description: 'OWASP compliance rating'
    },
    {
      id: 'metric-5',
      label: 'Message Throughput',
      value: '5k/sec',
      trend: 'up',
      category: 'Performance',
      description: 'Kafka message processing rate'
    },
    {
      id: 'metric-6',
      label: 'Error Rate',
      value: '0.01%',
      trend: 'down',
      category: 'Availability',
      description: 'Application error percentage'
    }
  ]);

  constructor() {}

  getMetrics(): Observable<MetricEntry[]> {
    return this.metrics$.asObservable();
  }

  getMetricById(id: string): Observable<MetricEntry | undefined> {
    return new Observable(observer => {
      const metric = this.metrics$.value.find(m => m.id === id);
      observer.next(metric);
      observer.complete();
    });
  }

  addMetric(metric: MetricEntry): void {
    const current = this.metrics$.value;
    this.metrics$.next([...current, { ...metric, id: `metric-${Date.now()}` }]);
  }

  updateMetric(id: string, metric: Partial<MetricEntry>): void {
    const current = this.metrics$.value;
    const updated = current.map(m => m.id === id ? { ...m, ...metric } : m);
    this.metrics$.next(updated);
  }

  deleteMetric(id: string): void {
    const current = this.metrics$.value;
    this.metrics$.next(current.filter(m => m.id !== id));
  }
}
