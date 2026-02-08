import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Generate a random 32-character hex string for trace/span IDs
 */
function generateId(): string {
  let id = '';
  for (let i = 0; i < 16; i++) {
    id += Math.floor(Math.random() * 16).toString(16);
  }
  return id;
}

/**
 * Generate W3C Trace Context compliant traceparent header
 * Format: 00-{trace-id}-{span-id}-{trace-flags}
 */
function generateTraceContext(): { traceparent: string; traceId: string } {
  const traceId = generateId();
  const spanId = generateId().substring(0, 16);
  const traceFlags = '01'; // Sampled=true
  const traceparent = `00-${traceId}-${spanId}-${traceFlags}`;
  
  return { traceparent, traceId };
}

/**
 * HTTP Interceptor that adds W3C Trace Context headers to all HTTP requests.
 */
export const traceIdInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const { traceparent, traceId } = generateTraceContext();

  const clonedRequest = req.clone({
    setHeaders: {
      'traceparent': traceparent,
      'X-Trace-Id': traceId,
      'X-B3-TraceId': traceId,
      'X-B3-SpanId': traceId.substring(0, 16),
      'X-B3-Sampled': '1'
    }
  });

  if (req.method !== 'GET') {
    console.debug(`[TRACE-${traceId}] ${req.method} ${req.url}`);
  }

  return next(clonedRequest);
};

