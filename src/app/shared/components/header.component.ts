import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { ProfileService } from '@app/core/services';
import { UserProfile } from '@app/core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile = signal<UserProfile | null>(null);

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.profileService.getAll().subscribe(profiles => {
      if (profiles && profiles.length > 0) {
        this.profile.set(profiles[0]);
      } else {
        this.loadMock();
      }
    });
  }  


  loadMock(): void {
    this.profileService.getProfile().subscribe(profile => {
      this.profile.set(profile);
    });
  }  

  
  onHireClick(): void {
    this.router.navigate(['/hire']);
  }
}
