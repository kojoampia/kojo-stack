export type ProjectType = 'Microservices' | 'Monolith' | 'Migration' | 'DevOps' | 'Architecture' | 'ETL' | 'Monitoring' | 'Mentoring' | 'Code Review';
export type ProjectStatus = 'Live' | 'Completed' | 'Maintenance' | 'Pending';

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
