import { Routes } from '@angular/router';
import { UserRouteAccessService } from './core/auth/user-route-access-service';

/**
 * Public feature screens and the guarded admin area are all loaded on demand.
 * The dashboard is the default landing route, so it is the only feature chunk
 * most visitors pay for beyond the shell.
 *
 * MANAGEMENT_ROUTES is itself imported lazily: pulling it in eagerly would drag
 * every admin dashboard back into the initial bundle through the route table.
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@app/core/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login' }
  },
  {
    path: 'management',
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('@app/management/management.routes').then(m => m.MANAGEMENT_ROUTES),
    data: { title: 'Administration Dashboard', authorities: ['ROLE_ADMIN'] }
  },
  {
    path: '',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@app/features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('@app/features/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'docs',
        loadComponent: () => import('@app/features/docs/docs.component').then(m => m.DocsComponent)
      },
      {
        path: 'education',
        loadComponent: () =>
          import('@app/features/education/education.component').then(m => m.EducationComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@app/features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'hire',
        loadComponent: () => import('@app/features/hire/hire.component').then(m => m.HireComponent)
      }
    ]
  }
];
