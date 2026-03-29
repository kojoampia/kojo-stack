import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { trace } from '@opentelemetry/api';
import { Observable } from 'rxjs';

/**
 * HTTP interceptor that forwards active span IDs for log correlation.
 * W3C traceparent propagation is handled by OpenTelemetry XHR/Fetch instrumentation.
 */
export const traceIdInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const span = trace.getActiveSpan();
  const activeContext = span?.spanContext();

  if (!activeContext) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      'X-Trace-Id': activeContext.traceId,
      'X-B3-TraceId': activeContext.traceId,
      'X-B3-SpanId': activeContext.spanId,
      'X-B3-Sampled': activeContext.traceFlags === 1 ? '1' : '0'
    }
  });

  if (req.method !== 'GET') {
    console.debug(`[TRACE-${activeContext.traceId}] ${req.method} ${req.url}`);
  }

  return next(clonedRequest);
};

