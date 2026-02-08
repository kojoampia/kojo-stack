import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserProfile } from '@app/core/models/profile.model';
import { ProfileService } from '@app/core/services/profile.service';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  modelName = 'UserProfile';
  items: UserProfile[] = [];
  selectedItem: UserProfile | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' = 'list';
  loading = false;
  error: string | null = null;

  formData: Partial<UserProfile> = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    avatar: ''
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.profileService.getAll().subscribe({
      next: (items: UserProfile[]) => {
        this.items = items;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load profiles: ' + err.message;
        this.loading = false;
      }
    });
  }

  selectItem(item: UserProfile): void {
    this.selectedItem = item;
  }

  createItem(): void {
    this.currentAction = 'create';
    this.isCreating = true;
    this.selectedItem = null;
    this.formData = {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      avatar: ''
    };
    this.error = null;
  }

  editItem(item: UserProfile): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item };
    this.error = null;
  }

  deleteItem(item: UserProfile): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    const profile = { ...this.selectedItem, ...this.formData } as UserProfile;

    if (this.isCreating) {
      this.profileService.create(profile).subscribe({
        next: () => {
          this.loadItems();
          this.cancelAction();
        },
        error: (err: any) => {
          this.error = 'Failed to create profile: ' + err.message;
          this.loading = false;
        }
      });
    } else if (this.isUpdating && profile.id) {
      this.profileService.update(profile.id, profile).subscribe({
        next: () => {
          this.loadItems();
          this.cancelAction();
        },
        error: (err: any) => {
          this.error = 'Failed to update profile: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.loading = true;
      this.profileService.delete(this.selectedItem.id).subscribe({
        next: () => {
          this.loadItems();
          this.cancelAction();
        },
        error: (err: any) => {
          this.error = 'Failed to delete profile: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  cancelAction(): void {
    this.currentAction = 'list';
    this.isCreating = false;
    this.isUpdating = false;
    this.isDeleting = false;
    this.selectedItem = null;
    this.error = null;
    this.formData = {};
  }

  goBack(): void {
    this.cancelAction();
  }
}
