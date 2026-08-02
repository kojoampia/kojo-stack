import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { SERVER_API_URL } from '@app/app.constants';

/**
 * The auth interceptor decides which outbound requests receive the bearer token.
 * Attaching it too widely leaks the token to third-party hosts, and attaching it
 * too narrowly silently breaks every authenticated call, so both directions matter.
 */
describe('authInterceptor', () => {
  let forwarded: HttpRequest<unknown> | undefined;

  const next: HttpHandlerFn = req => {
    forwarded = req;
    return of(new HttpResponse() as HttpEvent<unknown>);
  };

  const run = (url: string): void => {
    authInterceptor(new HttpRequest('GET', url), next).subscribe();
  };

  beforeEach(() => {
    forwarded = undefined;
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('attaches the token from localStorage to API requests', () => {
    localStorage.setItem('authenticationToken', 'token-from-local');

    run(`${SERVER_API_URL}/api/v1/projects`);

    expect(forwarded?.headers.get('Authorization')).toBe('Bearer token-from-local');
  });

  it('falls back to sessionStorage when localStorage has no token', () => {
    sessionStorage.setItem('authenticationToken', 'token-from-session');

    run(`${SERVER_API_URL}/api/v1/projects`);

    expect(forwarded?.headers.get('Authorization')).toBe('Bearer token-from-session');
  });

  it('sends no Authorization header when no token is stored', () => {
    run(`${SERVER_API_URL}/api/v1/projects`);

    expect(forwarded?.headers.has('Authorization')).toBeFalse();
  });

  it('does not leak the token to an unrelated external host', () => {
    localStorage.setItem('authenticationToken', 'token-from-local');

    run('https://api.some-third-party.example.com/v1/data');

    expect(forwarded?.headers.has('Authorization')).toBeFalse();
  });

  it('leaves the original request untouched when no token applies', () => {
    const original = new HttpRequest('GET', 'https://external.example.com/thing');

    authInterceptor(original, req => {
      forwarded = req;
      return of(new HttpResponse() as HttpEvent<unknown>);
    }).subscribe();

    expect(forwarded).toBe(original);
  });
});
