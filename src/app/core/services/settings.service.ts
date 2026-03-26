import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '@app/core/models/setting.model';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${SERVER_API_URL}/api/v1/settings`;

  getAll(): Observable<AppSettings[]> {
    return this.http.get<AppSettings[]>(this.apiUrl);
  }

  getById(id: string): Observable<AppSettings> {
    return this.http.get<AppSettings>(`${this.apiUrl}/${id}`);
  }

  create(settings: Omit<AppSettings, 'id'>): Observable<AppSettings> {
    return this.http.post<AppSettings>(this.apiUrl, settings);
  }

  update(id: string, settings: Partial<AppSettings>): Observable<AppSettings> {
    return this.http.put<AppSettings>(`${this.apiUrl}/${id}`, settings);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
