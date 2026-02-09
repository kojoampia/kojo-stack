import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from '@app/core/models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = '/api/v1/settings';
  private settings$ = new BehaviorSubject<AppSettings>({
    id: 'default',
    verboseLogging: true,
    betaFeatures: false,
    theme: 'default',
    language: 'en'
  });

  constructor(private http: HttpClient) {}

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

  getSettings(): Observable<AppSettings> {
    return this.settings$.asObservable();
  }

  updateSettings(settings: Partial<AppSettings>): void {
    const current = this.settings$.value;
    this.settings$.next({ ...current, ...settings });
  }
}
