import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { traceIdInterceptor } from './app/core/interceptors/trace-id.interceptor';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { authExpiredInterceptor } from './app/core/interceptors/auth-expired.interceptor';
import { errorHandlerInterceptor } from './app/core/interceptors/errorhandler.interceptor';
import { notificationInterceptor } from './app/core/interceptors/notification.interceptor';

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Async variant: the animations engine is only needed by the Material
    // snackbar and overlay, so it is fetched as a separate chunk instead of
    // sitting in the initial bundle.
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      traceIdInterceptor,
      authInterceptor,
      authExpiredInterceptor,
      notificationInterceptor,
      errorHandlerInterceptor,
    ])),
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    // OpenTelemetry accounted for roughly half of the initial JavaScript bundle
    // while contributing nothing to first paint. Loading it after bootstrap keeps
    // it out of the critical path; document-load timings are read from the
    // Performance API, which retains them, so the instrumentation still reports.
    void import('./app/core/observability/opentelemetry')
      .then(m => m.initializeOpenTelemetry())
      .catch(err => console.error('OpenTelemetry initialization failed', err));
  })
  .catch(err => console.error(err));
