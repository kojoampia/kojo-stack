export type ProjectType = 'ARCHITECTURE' | 'MICROSERVICES'| 'DEVOPS' | 'BACKEND_SERVICE' | 'FRONTEND' | 'FULL_STACK' | 'DATA_ENGINEERING' | 'CONSULTING' | 'MIGRATION' | 'ETL' | 'MONITORING' | 'CODE_REVIEW' | 'MENTORING' | 'TRANSFORMATION';
export type ProjectStatus = 'LIVE' | 'PENDING' | 'MAINTENANCE' | 'CONSULTING' | 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED'

export interface Project {
  id?: string;
  name: string;
  client: string;
  type: ProjectType;
  description: string;
  stack: string[];
  status: ProjectStatus;
  architecture: string;
}
