import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL, KS_DASHBOARD_URL } from '@app/app.constants';
import { Login } from '../login/login.model';

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(private readonly http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem('authenticationToken') || sessionStorage.getItem('authenticationToken') || '';
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(SERVER_API_URL + '/api/v1/auth', credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      localStorage.removeItem('authenticationToken');
      sessionStorage.removeItem('authenticationToken');
      localStorage.removeItem('generalWebAuthenticationToken');
      sessionStorage.removeItem('generalWebAuthenticationToken');
      localStorage.removeItem('credentials');
      sessionStorage.removeItem('credentials');
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      localStorage.setItem('authenticationToken', jwt);
    } else {
      sessionStorage.setItem('authenticationToken', jwt);
    }
  }

  /** AUTHENTICATING ON GENERAL WEB FOR WEBSOCKET CONNECTION **/

  generalWebLogin(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(KS_DASHBOARD_URL + '/api/v1/auth', credentials)
      .pipe(map(response => this.generalWebAuthenticateSuccess(response, credentials.rememberMe)));
  }

  getGeneralWebToken(): string {
    return (
      localStorage.getItem('generalWebAuthenticationToken') || sessionStorage.getItem('generalWebAuthenticationToken') || ''
    );
  }

  private generalWebAuthenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      localStorage.setItem('generalWebAuthenticationToken', jwt);
    } else {
      sessionStorage.setItem('generalWebAuthenticationToken', jwt);
    }
  }
}
