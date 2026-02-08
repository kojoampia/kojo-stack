import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Setting } from '@app/core/models/setting.model';
import { SettingsService } from '@app/core/services/settings.service';

@Component({
  selector: 'app-setting-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './setting-dashboard.component.html',
  styleUrls: ['./setting-dashboard.component.scss']
})
export class SettingDashboardComponent implements OnInit {
  modelName = 'Setting';
  items: Setting[] = [];
  selectedItem: Setting | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' = 'list';
  loading = false;
  error: string | null = null;

  formData: Partial<Setting> = {
    verboseLogging: false,
    betaFeatures: false,
    theme: 'light'
  };

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.settingsService.getAll().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load settings: ' + err.message;
        this.loading = false;
      }
    });
  }

  selectItem(item: Setting): void {
    this.selectedItem = item;
  }

  createItem(): void {
    this.currentAction = 'create';
    this.isCreating = true;
    this.selectedItem = null;
    this.formData = { verboseLogging: false, betaFeatures: false, theme: 'light' };
    this.error = null;
  }

  editItem(item: Setting): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item };
    this.error = null;
  }

  deleteItem(item: Setting): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    const setting = { ...this.selectedItem, ...this.formData } as Setting;

    if (this.isCreating) {
      this.settingsService.create(setting).subscribe({
        next: () => {
          this.loadItems();
          this.cancelAction();
        },
        error: (err) => {
          this.error = 'Failed to create setting: ' + err.message;
          this.loading = false;
        }
      });
    } else if (this.isUpdating && setting.id) {
      this.settingsService.update(setting.id, setting).subscribe({
        next: () => {
          this.loadItems();
          this.cancelAction();
        },
        error: (err) => {
          this.error = 'Failed to update setting: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.loading = true;
      this.settingsService.delete(this.selectedItem.id).subscribe({
        next: () => {
          this.loadItems();
          this.cancelAction();
        },
        error: (err) => {
          this.error = 'Failed to delete setting: ' + err.message;
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
}
