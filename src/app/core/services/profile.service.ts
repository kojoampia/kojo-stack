import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from '@app/core/models/profile.model';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${SERVER_API_URL}/api/v1/profiles`;
  private profiles$ = new BehaviorSubject<UserProfile[]>([{
    id: 'jkaa-001',
    name: 'John Kojo Ampia-Addison',
    title: 'Senior Software Architect & DevOps Engineer',
    email: 'kojo.ampia@jojoaddison.net',
    phone: '+43 676 922 1796',
    location: 'Vienna, Austria',
    avatar: 'assets/kojo-ampia-addison.jpeg'
  }]);

  constructor(private http: HttpClient) {}

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

  getProfile(): Observable<UserProfile> {
    return this.profiles$.asObservable().pipe(
      map(profiles => profiles[0] || {
        id: 'jkaa-001',
        name: 'John Kojo Ampia-Addison',
        title: 'Senior Software Architect & DevOps Engineer',
        email: 'kojo.ampia@jojoaddison.net',
        phone: '+43 676 922 1796',
        location: 'Vienna, Austria',
        avatar: 'assets/kojo-ampia-addison.jpeg'
      })
    );
  }

  updateProfile(profile: Partial<UserProfile>): void {
    const current = this.profiles$.value;
    const updated = current.map(p => (p.id === profile.id ? { ...p, ...profile } : p));
    this.profiles$.next(updated);
  }
}
