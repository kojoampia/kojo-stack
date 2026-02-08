import { Metric } from './metric.model';

export type ExperienceStatus = 'ACTIVE' | 'STABLE' | 'DEPRECATED' | 'MIGRATED' | 'COMPLETED' | 'PENDING' | 'ARCHIVED' | 'MAINTENANCE';

export interface Experience {
  id?: string;
  company: string;
  role: string;
  period: string;
  status: ExperienceStatus;
  description: string;
  stack: string[];
  metrics: Metric[];
}
