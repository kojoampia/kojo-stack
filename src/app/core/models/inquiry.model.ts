import { ProjectType } from './project.model';

export interface ConsultingInquiry {
  name: string;
  email: string;
  type: ProjectType;
  message: string;
}
