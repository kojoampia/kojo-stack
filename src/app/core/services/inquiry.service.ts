import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConsultingInquiry } from '../models/inquiry.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';


export interface Inquiry extends ConsultingInquiry {
  id?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  readonly apiUrl = `${SERVER_API_URL}/api/inquiries`;
  readonly http = inject(HttpClient);

  private inquiries$ = new BehaviorSubject<Inquiry[]>([
    {
      id: 'inq-1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      type: 'Microservices',
      message: 'Looking for help with microservices architecture design for our e-commerce platform.',
      status: 'New',
      createdAt: '2025-12-01'
    },
    {
      id: 'inq-2',
      name: 'Sarah Johnson',
      email: 'sarah.j@startup.io',
      type: 'DevOps',
      message: 'Need consulting on CI/CD pipeline setup and Kubernetes deployment.',
      status: 'Contacted',
      createdAt: '2025-11-15'
    },
    {
      id: 'inq-3',
      name: 'Michael Chen',
      email: 'm.chen@enterprise.com',
      type: 'Migration',
      message: 'Planning to migrate legacy Java application to cloud-native architecture.',
      status: 'In Progress',
      createdAt: '2025-10-20'
    }
  ]);

  constructor() {}

  getInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(this.apiUrl);
  }

  getInquiryById(id: string): Observable<Inquiry | undefined> {
    return this.http.get<Inquiry>(`${this.apiUrl}/${id}`);
  }

  createInquiry(inquiry: Inquiry): Observable<Inquiry> {
    return this.http.post<Inquiry>(this.apiUrl, inquiry);
  }

  updateInquiry(id: string, inquiry: Inquiry): Observable<Inquiry> {
    return this.http.put<Inquiry>(`${this.apiUrl}/${id}`, inquiry);
  }

  deleteInquiry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
