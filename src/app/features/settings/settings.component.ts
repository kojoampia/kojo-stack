import { Component, OnInit, signal } from '@angular/core';
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

  profile = signal<UserProfile | null>(null);
  settings = signal<AppSettings | null>(null);
  status = signal<string | null>(null);

  constructor(
    private readonly profileService: ProfileService,
    private readonly settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(profile => {
      this.profile.set(profile);
    });

    this.settingsService.getSettings().subscribe(settings => {
      this.settings.set(settings);
    });
  }

  saveSettings(): void {
    this.status.set('Settings saved.')
    setTimeout(() => {
        this.status.set(null);
    }, 1000);
  }
}
