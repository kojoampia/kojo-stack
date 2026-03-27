export interface Kpi {
  id?: string;
  label: string;
  value: string;
  unit?: string;
  icon?: string;
  color?: string;
  progress?: number;
  subtitle?: string;
  sortOrder?: number;
}
