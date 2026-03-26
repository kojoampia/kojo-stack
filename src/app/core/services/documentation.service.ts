import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Documentation } from '../models/documentation.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/docs`;
  readonly http: HttpClient = inject(HttpClient);

  getDocuments(): Observable<Documentation[]> {
    return this.http.get<Documentation[]>(this.apiUrl);
  }

  createDocument(doc: Documentation): Observable<Documentation> {
    return this.http.post<Documentation>(this.apiUrl, doc);
  }

  updateDocument(id: string, doc: Documentation): Observable<Documentation> {
    return this.http.put<Documentation>(`${this.apiUrl}/${id}`, doc);
  }

  getDocumentById(id: string): Observable<Documentation> {
    return this.http.get<Documentation>(`${this.apiUrl}/${id}`);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
