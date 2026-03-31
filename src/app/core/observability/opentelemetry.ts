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

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new UserInteractionInstrumentation(),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [/./]
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [/./]
      })
    ]
  });
}
