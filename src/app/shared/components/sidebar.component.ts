import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AccountService } from '@app/core/auth/account.service';
import { AuthServerProvider } from '@app/core/auth/auth-jwt.service';
import { UserProfile } from '@app/core/models';
import { ProfileService } from '@app/core/services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentView = signal<string>('Dashboard');
  avatarError = signal(false);
  navItems = ['Dashboard', 'Projects', 'Docs', 'Education', 'Settings', 'Hire'];
  isLoggedIn = signal<boolean>(false);
  profile = signal<UserProfile | null>(null);

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly authenticationService: AuthServerProvider,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.isLoggedIn.set(this.accountService.isAuthenticated());

    // Update currentView when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects as string;
        const route = url.split('/').pop() || 'Dashboard';
        const viewName = route.charAt(0).toUpperCase() + route.slice(1);
        this.currentView.set(viewName);
      });

    this.profileService.getProfile().subscribe(profile => {
      this.profile.set(profile);
    });
  }

  onNavClick(view: string): void {
    this.currentView.set(view);
    this.router.navigate([`/${view.toLowerCase()}`]);
  }

  onAdminClick(): void {
    this.currentView.set('Management');
    this.router.navigate(['/management']);
  }

  onLogout(): void {
    this.authenticationService.logout();
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  onAvatarError(): void {
    this.avatarError.set(true);
  }
}
