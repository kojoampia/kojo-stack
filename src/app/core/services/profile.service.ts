import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from '@app/core/models/profile.model';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${SERVER_API_URL}/api/v1/profiles`;

  getAll(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl);
  }

  getById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  create(profile: Omit<UserProfile, 'id'>): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, profile);
  }

  update(id: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, profile);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDefault(): Observable<UserProfile> {
    return this.getAll().pipe(
      map(profiles => profiles[0])
    );
  }
}
