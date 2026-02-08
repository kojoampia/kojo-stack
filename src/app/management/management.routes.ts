import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { SettingDashboardComponent } from './setting-dashboard/setting-dashboard.component';
import { DocumentationDashboardComponent } from './documentation-dashboard/documentation-dashboard.component';
import { ExperienceDashboardComponent } from './experience-dashboard/experience-dashboard.component';
import { SkillDashboardComponent } from './skill-dashboard/skill-dashboard.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { InquiryDashboardComponent } from './inquiry-dashboard/inquiry-dashboard.component';
import { MetricDashboardComponent } from './metric-dashboard/metric-dashboard.component';
import { EducationDashboardComponent } from './education-dashboard/education-dashboard.component';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    data: { title: 'Administration Dashboard' }
  },
  {
    path: 'profiles',
    component: ProfileDashboardComponent,
    data: { title: 'Profile Management' }
  },
  {
    path: 'settings',
    component: SettingDashboardComponent,
    data: { title: 'Settings Management' }
  },
  {
    path: 'documentation',
    component: DocumentationDashboardComponent,
    data: { title: 'Documentation Management' }
  },
  {
    path: 'experience',
    component: ExperienceDashboardComponent,
    data: { title: 'Experience Management' }
  },
  {
    path: 'skills',
    component: SkillDashboardComponent,
    data: { title: 'Skill Management' }
  },
  {
    path: 'projects',
    component: ProjectDashboardComponent,
    data: { title: 'Project Management' }
  },
  {
    path: 'inquiries',
    component: InquiryDashboardComponent,
    data: { title: 'Inquiry Management' }
  },
  {
    path: 'metrics',
    component: MetricDashboardComponent,
    data: { title: 'Metric Management' }
  },
  {
    path: 'education',
    component: EducationDashboardComponent,
    data: { title: 'Education Management' }
  }
];
