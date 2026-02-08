import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
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
    provideAnimations(),
    provideHttpClient(withInterceptors([
      traceIdInterceptor,
      authInterceptor,
      authExpiredInterceptor,
      notificationInterceptor,
      errorHandlerInterceptor,
    ])),
  ]
};

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
