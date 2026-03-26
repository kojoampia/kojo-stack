import { Component, OnInit, inject, signal } from '@angular/core';
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
  private readonly settingsService = inject(SettingsService);

  modelName = 'Setting';
  items = signal<Setting[]>([]);
  selectedItem: Setting | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' = 'list';
  error: string | null = null;

  formData: Partial<Setting> = {
    verboseLogging: false,
    betaFeatures: false,
    theme: 'light'
  };

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.settingsService.getAll().subscribe({
      next: (items) => {
        this.items.set(items);
      },
      error: (err) => {
        this.error = 'Failed to load settings: ' + err.message;
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
    const setting = { ...this.selectedItem, ...this.formData } as Setting;

    if (this.isCreating) {
      this.settingsService.create(setting).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err) => {
          this.error = 'Failed to create setting: ' + err.message;
        }
      });
    } else if (this.isUpdating && setting.id) {
      this.settingsService.update(setting.id, setting).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err) => {
          this.error = 'Failed to update setting: ' + err.message;
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.settingsService.delete(this.selectedItem.id).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err) => {
          this.error = 'Failed to delete setting: ' + err.message;
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
