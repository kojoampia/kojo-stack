import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserProfile } from '@app/core/models/profile.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpCache } from './http-cache';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${SERVER_API_URL}/api/v1/profiles`;

  /**
   * The header and the sidebar both read the profile on every navigation, so
   * this list is shared rather than refetched per subscriber.
   */
  private readonly cache = new HttpCache<UserProfile[]>();

  getAll(): Observable<UserProfile[]> {
    return this.cache.read(() => this.http.get<UserProfile[]>(this.apiUrl));
  }

  getById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  create(profile: Omit<UserProfile, 'id'>): Observable<UserProfile> {
    return this.http
      .post<UserProfile>(this.apiUrl, profile)
      .pipe(tap(() => this.cache.invalidate()));
  }

  update(id: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http
      .put<UserProfile>(`${this.apiUrl}/${id}`, profile)
      .pipe(tap(() => this.cache.invalidate()));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.cache.invalidate()));
  }

  getDefault(): Observable<UserProfile> {
    return this.getAll().pipe(map(profiles => profiles[0]));
  }
}
