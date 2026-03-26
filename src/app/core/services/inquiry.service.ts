import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
  readonly apiUrl = `${SERVER_API_URL}/api/v1/inquiries`;
  readonly http = inject(HttpClient);

  getInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(this.apiUrl);
  }

  getInquiryById(id: string): Observable<Inquiry | undefined> {
    return this.http.get<Inquiry>(`${this.apiUrl}/${id}`);
  }

  createInquiry(inquiry: Inquiry): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${this.apiUrl}/submit`, inquiry);
  }

  updateInquiry(id: string, inquiry: Inquiry): Observable<Inquiry> {
    return this.http.put<Inquiry>(`${this.apiUrl}/${id}`, inquiry);
  }

  deleteInquiry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
