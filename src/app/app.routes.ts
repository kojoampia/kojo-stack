import { Routes } from '@angular/router';
import { DashboardComponent } from '@app/features/dashboard/dashboard.component';
import { ProjectsComponent } from '@app/features/projects/projects.component';
import { DocsComponent } from '@app/features/docs/docs.component';
import { SettingsComponent } from '@app/features/settings/settings.component';
import { HireComponent } from '@app/features/hire/hire.component';
import { EducationComponent } from '@app/features/education/education.component';
import { LoginComponent } from '@app/core/login/login.component';
import { MANAGEMENT_ROUTES } from '@app/management/management.routes';
import { UserRouteAccessService } from './core/auth/user-route-access-service';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'management',
    canActivate: [UserRouteAccessService],
    children: MANAGEMENT_ROUTES,
    data: { title: 'Administration Dashboard', authorities: ['ROLE_ADMIN'] }
  },
  {
    path: '',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'docs', component: DocsComponent },
      { path: 'education', component: EducationComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'hire', component: HireComponent },
    ]
  }
];
