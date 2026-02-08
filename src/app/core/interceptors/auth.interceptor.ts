import { Observable } from 'rxjs';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { KS_DASHBOARD_URL, SERVER_API_URL } from '@app/app.constants';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (KS_DASHBOARD_URL && req.url.startsWith(KS_DASHBOARD_URL)) {
    const token =
      localStorage.getItem('generalWebAuthenticationToken') || sessionStorage.getItem('generalWebAuthenticationToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
    return next(req);
  }

  if (!req?.url || (req.url?.startsWith('http') && !(SERVER_API_URL && req.url?.startsWith(SERVER_API_URL)))) {
    return next(req);
  }

  const token = localStorage.getItem('authenticationToken') || sessionStorage.getItem('authenticationToken');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
      },
    });
  }
  return next(req);
};
