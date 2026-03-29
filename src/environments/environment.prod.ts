export const environment = {
  production: true,
  apiUrl: '',
  logLevel: 'error',
  observability: {
    enabled: true,
    serviceName: 'kojo-stack-web',
    serviceVersion: '2026.1.0',
    tracesEndpoint: '/otlp/v1/traces',
    metricsEndpoint: '/otlp/v1/metrics',
    logsEndpoint: '/otlp/v1/logs'
  }
};
