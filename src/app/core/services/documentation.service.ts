import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Documentation } from '../models/documentation.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { HttpCache } from './http-cache';


@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  readonly apiUrl = `${SERVER_API_URL}/api/v1/docs`;

  /** Public read-mostly content; shared across subscribers and navigations. */
  private readonly cache = new HttpCache<Documentation[]>();
  readonly http: HttpClient = inject(HttpClient);

  getDocuments(): Observable<Documentation[]> {
    return this.cache.read(() => this.http.get<Documentation[]>(this.apiUrl));
  }

  createDocument(doc: Documentation): Observable<Documentation> {
    return this.http.post<Documentation>(this.apiUrl, doc).pipe(tap(() => this.cache.invalidate()));
  }

  updateDocument(id: string, doc: Documentation): Observable<Documentation> {
    return this.http.put<Documentation>(`${this.apiUrl}/${id}`, doc).pipe(tap(() => this.cache.invalidate()));
  }

  getDocumentById(id: string): Observable<Documentation> {
    return this.http.get<Documentation>(`${this.apiUrl}/${id}`);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache.invalidate()));
  }

}
