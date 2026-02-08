import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([
    {
      id: 'proj-1',
      name: 'Health Brokerage Platform',
      client: 'Abofonsa Mobile Health',
      type: 'Microservices',
      description: 'Near-real time communication brokerage using Kafka streams for mobile health data processing.',
      stack: ['Java 17', 'Kafka', 'MongoDB', 'JHipster', 'Angular 17'],
      status: 'Live',
      architecture: 'Event-Driven'
    },
    {
      id: 'proj-2',
      name: 'Enterprise GitOps Pipeline',
      client: 'BRZ',
      type: 'DevOps',
      description: 'Infrastructure as Code design and OpenTelemetry integration for federal computing services.',
      stack: ['Kubernetes', 'ArgoCD', 'OpenTelemetry', 'Java 21'],
      status: 'Live',
      architecture: 'Cloud Native'
    },
    {
      id: 'proj-3',
      name: 'Insurance Portal (OWASP)',
      client: 'Bedrock Insurance',
      type: 'Microservices',
      description: 'Secure policy management dashboards and public facing website compliant with OWASP Top 10 standards.',
      stack: ['Spring Security', 'Angular 10', 'JWT', 'Netflix OSS'],
      status: 'Maintenance',
      architecture: 'Microservices'
    },
    {
      id: 'proj-4',
      name: 'OpenShift Cloud Migration',
      client: 'Accenture',
      type: 'Migration',
      description: 'Large-scale migration of legacy applications to OpenShift PaaS with custom SLI/SLO monitoring.',
      stack: ['OpenShift', 'Helm', 'PromQL', 'Groovy'],
      status: 'Completed',
      architecture: 'Hybrid Cloud'
    },
    {
      id: 'proj-5',
      name: 'Ticketshop Monitoring',
      client: 'ÖBB',
      type: 'Monitoring',
      description: 'High-availability monitoring solution for national rail ticketing operations using Elastic Stack.',
      stack: ['Elasticsearch', 'Grafana', 'OracleDB'],
      status: 'Completed',
      architecture: 'Observability'
    },
    {
      id: 'proj-6',
      name: 'Interconnection Billing',
      client: 'T-Mobile Austria',
      type: 'ETL',
      description: 'Optimization of routine operations for the Interconnection Billing Process implementation on Mediation Zone.',
      stack: ['Java 6', 'Oracle DB', 'PL/SQL', 'Cognos'],
      status: 'Completed',
      architecture: 'Legacy'
    }
  ]);

  constructor() {}

  getProjects(): Observable<Project[]> {
    return this.projects$.asObservable();
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return new Observable(observer => {
      const project = this.projects$.value.find(p => p.id === id);
      observer.next(project);
      observer.complete();
    });
  }

  addProject(project: Project): void {
    const current = this.projects$.value;
    this.projects$.next([...current, { ...project, id: `proj-${Date.now()}` }]);
  }

  updateProject(id: string, project: Partial<Project>): void {
    const current = this.projects$.value;
    const updated = current.map(p => p.id === id ? { ...p, ...project } : p);
    this.projects$.next(updated);
  }
}
