import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StateStorageService } from '../auth/state-storage.service';
import { LoginService } from '../login/login.service';

export const authExpiredInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loginService = inject(LoginService);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      next: () => {},
      error: (err: HttpErrorResponse) => {
        if (err.status === 401 && err.url && !err.url.includes('api/v1/account')) {
          stateStorageService.storeUrl(router.routerState.snapshot.url);
          loginService.logout();
          router.navigate(['/login']);
        }
      },
    })
  );
};
