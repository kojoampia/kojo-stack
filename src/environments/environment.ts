export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085',
  logLevel: 'debug',
  observability: {
    enabled: true,
    serviceName: 'kojo-stack-web',
    serviceVersion: '2026.1.0',
    tracesEndpoint: 'http://localhost:5318/v1/traces',
    metricsEndpoint: 'http://localhost:5318/v1/metrics',
    logsEndpoint: 'http://localhost:5318/v1/logs'
  }
};
