import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Experience } from '../models/experience.model';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';


@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/experiences`;
  readonly http = inject(HttpClient);
  private experiences$ = new BehaviorSubject<Experience[]>([
    {
      id: 'exp-1',
      company: 'Bundesrechenzentrum (BRZ)',
      role: 'Software Developer & DevOps Engineer',
      period: '07/2024 - Present',
      status: 'ACTIVE',
      description: 'Refactoring core APIs and designing GitOps infrastructure. Implementing OpenTelemetry for full system observability.',
      stack: ['Java 21', 'Spring Boot', 'OpenTelemetry', 'Kubernetes', 'DB2', 'Grafana'],
      metrics: [
        { label: 'API Availability', value: '99.95%', trend: 'up' },
        { label: 'Latency', value: '<50ms', trend: 'stable' },
        { label: 'Deploys/Week', value: '15+', trend: 'up' }
      ]
    },
    {
      id: 'exp-2',
      company: 'Abofonsa Mobile Health',
      role: 'Lead Architect (Pro-bono)',
      period: '03/2022 - Present',
      status: 'ACTIVE',
      description: 'Led development of a Near-Real Time communication brokerage platform for mobile health services.',
      stack: ['JHipster', 'Kafka', 'MongoDB', 'Angular 17', 'Docker'],
      metrics: [
        { label: 'Msg Throughput', value: '5k/sec', trend: 'up' },
        { label: 'Users', value: 'Scaling', trend: 'up' }
      ]
    },
    {
      id: 'exp-3',
      company: 'Accenture',
      role: 'Senior DevOps Engineer',
      period: '06/2022 - 08/2023',
      status: 'STABLE',
      description: 'Application Migration to OpenShift PaaS. Designed custom metrics for SLI/SLO monitoring using PromQL.',
      stack: ['OpenShift', 'Helm', 'Jenkins', 'Prometheus', 'ELK Stack'],
      metrics: [
        { label: 'Migration', value: '100%', trend: 'stable' },
        { label: 'SLO Target', value: 'Met', trend: 'stable' }
      ]
    },
    {
      id: 'exp-4',
      company: 'Bedrock Insurance',
      role: 'Senior Software Architect',
      period: '08/2020 - 12/2022',
      status: 'STABLE',
      description: 'Developed Owasp T10 compliant web application with dashboards for Operations and Business Admin.',
      stack: ['Java 11', 'Microservices', 'Spring Security', 'Angular 10'],
      metrics: [
        { label: 'Security Score', value: 'A+', trend: 'up' }
      ]
    },
    {
      id: 'exp-5',
      company: 'Austrian Railways (ÖBB)',
      role: 'Monitoring & DevOps Engineer',
      period: '02/2019 - 10/2021',
      status: 'DEPRECATED',
      description: 'Ticketshop Operations Monitoring. Built dashboards using Elastic Stack and customized alert configurations.',
      stack: ['Elasticsearch', 'Grafana', 'OracleDB', 'Angular'],
      metrics: [
        { label: 'Uptime', value: '99.9%', trend: 'stable' }
      ]
    }
  ]);

  constructor() {}

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

  fetchExperiences(): Observable<Experience[]>  {
    return this.experiences$.asObservable();
  }

}
