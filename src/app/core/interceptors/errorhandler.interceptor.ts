import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastData } from '@app/shared/toast/toast.component';
import { LoadingService } from '../../shared/toast/loading.service';
import { ToastService } from '../../shared/toast/toast.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    tap({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        loadingService.hide();
        if (
          !(
            error.status === 401 &&
            (error.message === '' || error.url?.includes('api/v1/account'))
          )
        ) {
          toastService.open(
            { type: 'error', message: error.message } as ToastData,
            5000
          );
        }
      },
    })
  );
};
