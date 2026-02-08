export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}
