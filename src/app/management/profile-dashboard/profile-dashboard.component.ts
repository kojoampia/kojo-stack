import { Component, OnInit, inject, signal } from '@angular/core';
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
  private readonly profileService = inject(ProfileService);

  modelName = 'UserProfile';
  items = signal<UserProfile[]>([]);
  selectedItem: UserProfile | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' = 'list';
  error: string | null = null;

  formData: Partial<UserProfile> = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    avatar: ''
  };

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.profileService.getAll().subscribe({
      next: (items: UserProfile[]) => {
        this.items.set(items);
        this.error = null;
      },
      error: (err: any) => {
        this.error = 'Failed to load profiles: ' + err.message;
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
    const profile = { ...this.selectedItem, ...this.formData } as UserProfile;

    if (this.isCreating) {
      this.profileService.create(profile).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err: any) => {
          this.error = 'Failed to create profile: ' + err.message;
        }
      });
    } else if (this.isUpdating && profile.id) {
      this.profileService.update(profile.id, profile).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err: any) => {
          this.error = 'Failed to update profile: ' + err.message;
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.profileService.delete(this.selectedItem.id).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err: any) => {
          this.error = 'Failed to delete profile: ' + err.message;
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
