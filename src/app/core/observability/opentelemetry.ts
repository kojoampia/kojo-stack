import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { Resource } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { environment } from '../../../environments/environment';

function resolveUrl(endpoint: string): string {
  return endpoint.startsWith('/') ? `${window.location.origin}${endpoint}` : endpoint;
}

let initialized = false;

export function initializeOpenTelemetry(): void {
  if (initialized || !environment.observability?.enabled) {
    return;
  }

  initialized = true;

  if (!environment.production) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
  }

  const resource = new Resource({
    'service.name': environment.observability.serviceName,
    'service.version': environment.observability.serviceVersion,
    'deployment.environment': environment.production ? 'prod' : 'dev'
  });

  const traceExporter = new OTLPTraceExporter({
    url: resolveUrl(environment.observability.tracesEndpoint)
  });

  const tracerProvider = new WebTracerProvider({ resource });
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
  tracerProvider.register({
    contextManager: new ZoneContextManager()
  });

  const metricExporter = new OTLPMetricExporter({
    url: resolveUrl(environment.observability.metricsEndpoint)
  });

  const meterProvider = new MeterProvider({ resource });
  meterProvider.addMetricReader(
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000
    })
  );

  const logExporter = new OTLPLogExporter({
    url: resolveUrl(environment.observability.logsEndpoint)
  });

  const loggerProvider = new LoggerProvider({ resource });
  loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
  logs.setGlobalLoggerProvider(loggerProvider);

  // Only propagate the traceparent header to our own API. The previous [/./]
  // matched every URL, which added the header to cross-origin requests and so
  // turned otherwise simple requests into preflighted ones - an extra OPTIONS
  // round trip on every call, and an outright failure for any third-party host
  // whose CORS policy does not allow the header.
  const propagateTraceHeaderCorsUrls = buildPropagationAllowlist();

  // Telemetry export must not be traced by the instrumentation that produces it,
  // or a failing collector generates spans describing its own failed exports.
  const ignoreUrls = [/\/v1\/(traces|metrics|logs)$/, /\/otlp\//];

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new UserInteractionInstrumentation(),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls,
        ignoreUrls
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls,
        ignoreUrls
      })
    ]
  });
}

/**
 * Hosts that should receive the traceparent header. Same-origin requests never
 * need CORS, so this only matters when the API is served from another origin -
 * in production apiUrl is empty and everything is same-origin via the nginx
 * /api proxy.
 */
function buildPropagationAllowlist(): RegExp[] {
  const apiUrl = environment.apiUrl;
  if (!apiUrl) {
    return [];
  }
  const escaped = apiUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [new RegExp(`^${escaped}`)];
}
