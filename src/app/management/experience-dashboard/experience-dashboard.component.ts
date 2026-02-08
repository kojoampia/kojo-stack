import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Experience, ExperienceStatus } from '@app/core/models/experience.model';
import { Metric } from '@app/core/models/metric.model';
import { ExperienceService } from '@app/core/services/experience.service';

@Component({
  selector: 'app-experience-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './experience-dashboard.component.html',
  styleUrls: ['./experience-dashboard.component.scss']
})
export class ExperienceDashboardComponent implements OnInit {
  modelName = 'Experience';
  items: Experience[] = [];
  selectedItem: Experience | null = null;
  detailItem: Experience | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  loading = false;
  error: string | null = null;

  statusOptions: ExperienceStatus[] = ['ACTIVE', 'STABLE', 'DEPRECATED', 'MIGRATED', 'COMPLETED', 'PENDING', 'ARCHIVED', 'MAINTENANCE'];

  formData: Partial<Experience> = {
    company: '',
    role: '',
    period: '',
    status: 'ACTIVE',
    description: '',
    stack: [],
    metrics: []
  };

  stackInput = '';
  newMetric: Metric = { label: '', value: '', trend: 'stable' };

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.experienceService.getExperiences().subscribe({
      next: (items: Experience[]) => {
        this.items = items;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load experiences: ' + err.message;
        this.loading = false;
      }
    });
  }

  selectItem(item: Experience): void {
    this.selectedItem = item;
  }

  viewItem(item: Experience): void {
    this.currentAction = 'view';
    this.isViewing = true;
    this.detailItem = item;
    this.error = null;
  }

  createItem(): void {
    this.currentAction = 'create';
    this.isCreating = true;
    this.selectedItem = null;
    this.stackInput = '';
    this.formData = {
      company: '',
      role: '',
      period: '',
      status: 'ACTIVE',
      description: '',
      stack: [],
      metrics: []
    };
    this.error = null;
  }

  editItem(item: Experience): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item, stack: [...item.stack], metrics: [...item.metrics] };
    this.stackInput = item.stack.join(', ');
    this.error = null;
  }

  deleteItem(item: Experience): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  addMetric(): void {
    if (this.newMetric.label && this.newMetric.value) {
      if (!this.formData.metrics) {
        this.formData.metrics = [];
      }
      this.formData.metrics.push({ ...this.newMetric });
      this.newMetric = { label: '', value: '', trend: 'stable' };
    }
  }

  removeMetric(index: number): void {
    if (this.formData.metrics) {
      this.formData.metrics.splice(index, 1);
    }
  }

  saveItem(): void {
    this.loading = true;
    
    // Parse stack from comma-separated input
    this.formData.stack = this.stackInput.split(',').map(s => s.trim()).filter(s => s);
    
    const experience = { ...this.selectedItem, ...this.formData } as Experience;

    if (this.isCreating) {
      this.experienceService.createExperience(experience);
      this.loadItems();
      this.cancelAction();
    } else if (this.isUpdating && experience.id) {
      this.experienceService.updateExperience(experience.id, experience);
      this.loadItems();
      this.cancelAction();
    }
    this.loading = false;
  }

  confirmDelete(): void {
    this.cancelAction();
    this.loadItems();
  }

  cancelAction(): void {
    this.currentAction = 'list';
    this.isCreating = false;
    this.isUpdating = false;
    this.isDeleting = false;
    this.isViewing = false;
    this.selectedItem = null;
    this.detailItem = null;
    this.error = null;
    this.formData = {};
    this.stackInput = '';
  }

  goBack(): void {
    this.cancelAction();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Active': 'badge-success',
      'STABLE': 'badge-info',
      'Deprecated': 'badge-warning',
      'Migrated': 'badge-default'
    };
    return statusClasses[status] || 'badge-default';
  }
}
