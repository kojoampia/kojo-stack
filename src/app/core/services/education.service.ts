import { Injectable, inject } from '@angular/core';
import { Education } from '../models/education.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private education$ = new BehaviorSubject<Education[]>([
    {
      institution: "Computer, Munich - Germany",
      subjects: ["Monitoring and Security"],
      type: "Professional Workshop",
      duration: "June, 2019"
    },
    {
      institution: "Thales Group, Vienna - Austria",
      subjects: ["Data Security and Privacy"],
      type: "Professional Study",
      duration: "June, 2017"
    },
    {
      institution: "Thales Group, Vienna - Austria",
      subjects: ["Railway Signaling and Control"],
      type: "Professional Workshop",
      duration: "June, 2016"
    },
    {
      institution: "Thales Group, Vienna - Austria",
      subjects: ["Cyber Security"],
      type: "Professional Study",
      duration: "June, 2015"
    },
    {
      institution: "University of Technology (TU Wien), Vienna - Austria",
      subjects: ["Computer Science", "Economics"],
      type: "University Bachelor Education",
      duration: "October, 2004 - June 2010"
    },
    {
      institution: "Vorstudienlehrgang der Wieneruniversitäten, Vienna - Austria",
      subjects: ["Mathematics", "Physics", "German"],
      type: "Pre University School",
      duration: "October, 2002 - June 2004"
    },
    {
      institution: "Mfantsipim School, Cape Coast - Ghana",
      subjects: ["Mathematics", "Geography", "Economics", "General Paper"],
      type: "Secondary Advance Level",
      duration: "October, 1993 - June 1995"
    },
    {
      institution: "Mfantsipim School, Cape Coast - Ghana",
      subjects: ["Advanced Mathematics", "Physics", "Mathematics", "Chemistry", "Biology", "English", "Technical Drawing", "Geography"],
      type: "Secondary GCE Ordinary Level",
      duration: "September, 1987 - June 1992"
    }
  ]);

  readonly apiUrl = `${SERVER_API_URL}/api/v1/education`;
  readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  create(education: Education): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, education);
  }

  update(id: string, education: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/${id}`, education);
  }

  getById(id: string): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }

  getByType(type: string): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/type/${type}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEducation(): Observable<Education[]> {
    return this.education$.asObservable();
  }
}
