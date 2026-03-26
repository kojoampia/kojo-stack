import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, SettingsService } from '@app/core/services';
import { AppSettings, UserProfile } from '@app/core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly settingsService = inject(SettingsService);

  profile = signal<UserProfile | null>(null);
  settings = signal<AppSettings | null>(null);
  status = signal<string | null>(null);

  ngOnInit(): void {
    this.profileService.getDefault().subscribe(profile => {
      this.profile.set(profile);
    });

    this.settingsService.getAll().subscribe(settings => {
      if (settings && settings.length > 0) {
        this.settings.set(settings[0]);
      }
    });
  }

  saveSettings(): void {
    const current = this.settings();
    if (current?.id) {
      this.settingsService.update(current.id, current).subscribe({
        next: () => {
          this.status.set('Settings saved.');
          setTimeout(() => this.status.set(null), 1000);
        },
        error: () => {
          this.status.set('Failed to save settings.');
          setTimeout(() => this.status.set(null), 2000);
        }
      });
    }
  }
}
