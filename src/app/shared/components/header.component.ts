import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '@app/core/services';
import { UserProfile } from '@app/core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  profile = signal<UserProfile | null>(null);

  ngOnInit(): void {
    this.profileService.getAll().subscribe(profiles => {
      if (profiles && profiles.length > 0) {
        this.profile.set(profiles[0]);
      }
    });
  }  

  
  onHireClick(): void {
    this.router.navigate(['/hire']);
  }
}
