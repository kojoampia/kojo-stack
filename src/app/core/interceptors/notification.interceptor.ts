import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const notificationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        let alert: string | null = null;
        let alertParams: string | null = null;

        event.headers.keys().forEach(entry => {
          if (entry.toLowerCase().endsWith('app-alert')) {
            alert = event.headers.get(entry);
          } else if (entry.toLowerCase().endsWith('app-params')) {
            alertParams = decodeURIComponent(
              event.headers.get(entry)!.replace(/\+/g, ' ')
            );
          }
        });

        if (alert) {
          console.log(
            'Server Alert:',
            alert,
            alertParams ? '(' + alertParams + ')' : ''
          );
        }
      }
    })
  );
};
