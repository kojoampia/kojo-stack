import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface DashboardMenuItem {
  title: string;
  description: string;
  icon: string;
  emoji: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  menuItems: DashboardMenuItem[] = [];
  iconMap: { [key: string]: string } = {
    person: '👤',
    settings: '⚙️',
    description: '📄',
    school: '🎓',
    work: '💼',
    folder: '📁',
    mail: '📧',
    show_chart: '📊'
  };

  ngOnInit(): void {
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      {
        title: 'Projects',
        description: 'Manage projects',
        icon: 'folder',
        emoji: '📁',
        route: '/management/projects',
        color: 'warn'
      },
      {
        title: 'Documentation',
        description: 'Manage documentation',
        icon: 'description',
        emoji: '📄',
        route: '/management/documentation',
        color: 'warn'
      },
      {
        title: 'Experience',
        description: 'Manage work experience',
        icon: 'work',
        emoji: '💼',
        route: '/management/experience',
        color: 'accent'
      },
      {
        title: 'Skills',
        description: 'Manage technical skills',
        icon: 'school',
        emoji: '🎓',
        route: '/management/skills',
        color: 'primary'
      },
      {
        title: 'Inquiries',
        description: 'Manage inquiries',
        icon: 'mail',
        emoji: '📧',
        route: '/management/inquiries',
        color: 'primary'
      },
      {
        title: 'Education',
        description: 'Manage education records',
        icon: 'school',
        emoji: '🎓',
        route: '/management/education',
        color: 'warn'
      },
      {
        title: 'Profiles',
        description: 'Manage user profiles',
        icon: 'person',
        emoji: '👤',
        route: '/management/profiles',
        color: 'primary'
      },
      {
        title: 'Settings',
        description: 'Manage application settings',
        icon: 'settings',
        emoji: '⚙️',
        route: '/management/settings',
        color: 'accent'
      },
      {
        title: 'Metrics',
        description: 'View system metrics',
        icon: 'show_chart',
        emoji: '📊',
        route: '/management/metrics',
        color: 'accent'
      }
    ];
  }
}
