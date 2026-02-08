import { Injectable, inject } from '@angular/core';
import { TechSkill, SkillCategory } from '../models/tech-skill.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private skills$ = new BehaviorSubject<TechSkill[]>([
    // Backend
    { name: 'Java 8/11/17/21', category: 'Backend', level: 100, icon: 'java' },
    { name: 'Spring Boot & Cloud', category: 'Backend', level: 95, icon: 'leaf' },
    { name: 'Microservices', category: 'Backend', level: 90, icon: 'network-wired' },
    { name: 'JHipster', category: 'Backend', level: 90, icon: 'rocket' },
    
    // Frontend
    { name: 'Angular (10-17+)', category: 'Frontend', level: 95, icon: 'angular' },
    { name: 'TypeScript', category: 'Frontend', level: 90, icon: 'code' },
    
    // DevOps
    { name: 'Kubernetes & Helm', category: 'DevOps', level: 95, icon: 'dharmachakra' },
    { name: 'Docker', category: 'DevOps', level: 95, icon: 'docker' },
    { name: 'Jenkins CI/CD', category: 'DevOps', level: 90, icon: 'cogs' },
    { name: 'OpenShift', category: 'DevOps', level: 85, icon: 'cloud' },
    
    // Data
    { name: 'Apache Kafka', category: 'Data', level: 90, icon: 'stream' },
    { name: 'Elasticsearch/ELK', category: 'Data', level: 85, icon: 'search' },
    { name: 'SQL (Postgres/Oracle)', category: 'Data', level: 90, icon: 'database' },
    { name: 'MongoDB', category: 'Data', level: 90, icon: 'leaf' }
  ]);

  readonly apiUrl = `${SERVER_API_URL}/api/v1/skills`;
  readonly http: HttpClient = inject(HttpClient);

  constructor() {}

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

  getSkills(): Observable<TechSkill[]> {
    return this.skills$.asObservable();
  }

}
