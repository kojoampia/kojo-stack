import { Routes } from '@angular/router';

/**
 * Admin routes. Every dashboard is loaded on demand: these screens are reachable
 * only by an authenticated ROLE_ADMIN, so eagerly importing them shipped twelve
 * CRUD dashboards to every anonymous visitor reading the public portfolio.
 */
export const MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    data: { title: 'Administration Dashboard' }
  },
  {
    path: 'profiles',
    loadComponent: () =>
      import('./profile-dashboard/profile-dashboard.component').then(m => m.ProfileDashboardComponent),
    data: { title: 'Profile Management' }
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./setting-dashboard/setting-dashboard.component').then(m => m.SettingDashboardComponent),
    data: { title: 'Settings Management' }
  },
  {
    path: 'documentation',
    loadComponent: () =>
      import('./documentation-dashboard/documentation-dashboard.component').then(
        m => m.DocumentationDashboardComponent
      ),
    data: { title: 'Documentation Management' }
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./experience-dashboard/experience-dashboard.component').then(
        m => m.ExperienceDashboardComponent
      ),
    data: { title: 'Experience Management' }
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./skill-dashboard/skill-dashboard.component').then(m => m.SkillDashboardComponent),
    data: { title: 'Skill Management' }
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./project-dashboard/project-dashboard.component').then(m => m.ProjectDashboardComponent),
    data: { title: 'Project Management' }
  },
  {
    path: 'inquiries',
    loadComponent: () =>
      import('./inquiry-dashboard/inquiry-dashboard.component').then(m => m.InquiryDashboardComponent),
    data: { title: 'Inquiry Management' }
  },
  {
    path: 'metrics',
    loadComponent: () =>
      import('./metric-dashboard/metric-dashboard.component').then(m => m.MetricDashboardComponent),
    data: { title: 'Metric Management' }
  },
  {
    path: 'education',
    loadComponent: () =>
      import('./education-dashboard/education-dashboard.component').then(
        m => m.EducationDashboardComponent
      ),
    data: { title: 'Education Management' }
  },
  {
    path: 'kpis',
    loadComponent: () =>
      import('./kpi-dashboard/kpi-dashboard.component').then(m => m.KpiDashboardComponent),
    data: { title: 'KPI Management' }
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./account-dashboard/account-dashboard.component').then(m => m.AccountDashboardComponent),
    data: { title: 'Account Details' }
  }
];
