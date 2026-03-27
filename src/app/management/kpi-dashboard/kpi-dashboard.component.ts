import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KpiService } from '@app/core/services';
import { Kpi } from '@app/core/models';

type KpiColor = 'cyan' | 'purple' | 'green' | 'orange' | 'blue' | 'red' | 'yellow';

@Component({
  selector: 'app-kpi-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiDashboardComponent implements OnInit {
  private readonly kpiService = inject(KpiService);

  modelName = 'KPI';
  items = signal<Kpi[]>([]);
  selectedItem: Kpi | null = null;
  detailItem: Kpi | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  error: string | null = null;

  colorOptions: KpiColor[] = ['cyan', 'purple', 'green', 'orange', 'blue', 'red', 'yellow'];

  formData: Partial<Kpi> = {
    label: '',
    value: '',
    unit: '',
    icon: '',
    color: 'cyan',
    progress: undefined,
    subtitle: '',
    sortOrder: undefined
  };

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.kpiService.getAll().subscribe({
      next: (items: Kpi[]) => {
        this.items.set(items);
      },
      error: (err: Error) => {
        this.error = 'Failed to load KPIs: ' + err.message;
      }
    });
  }

  selectItem(item: Kpi): void {
    this.selectedItem = item;
  }

  viewItem(item: Kpi): void {
    this.currentAction = 'view';
    this.isViewing = true;
    this.detailItem = item;
    this.error = null;
  }

  createItem(): void {
    this.currentAction = 'create';
    this.isCreating = true;
    this.selectedItem = null;
    this.formData = {
      label: '',
      value: '',
      unit: '',
      icon: '',
      color: 'cyan',
      progress: undefined,
      subtitle: '',
      sortOrder: undefined
    };
    this.error = null;
  }

  editItem(item: Kpi): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.isViewing = false;
    this.detailItem = null;
    this.selectedItem = item;
    this.formData = { ...item };
    this.error = null;
  }

  deleteItem(item: Kpi): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    const kpi = { ...this.selectedItem, ...this.formData } as Kpi;

    if (this.isCreating) {
      this.kpiService.create(kpi).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to create KPI';
        }
      });
    } else if (this.isUpdating && kpi.id) {
      this.kpiService.update(kpi.id, kpi).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to update KPI';
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.kpiService.delete(this.selectedItem.id).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to delete KPI';
        }
      });
    } else {
      this.cancelAction();
    }
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
  }

  goBack(): void {
    this.cancelAction();
  }

  getColorClass(color: string | undefined): string {
    const colorClasses: { [key: string]: string } = {
      'cyan': 'color-cyan',
      'purple': 'color-purple',
      'green': 'color-green',
      'orange': 'color-orange',
      'blue': 'color-blue',
      'red': 'color-red',
      'yellow': 'color-yellow'
    };
    return colorClasses[color ?? ''] || '';
  }

  getColorLabel(color: string | undefined): string {
    return color ? color.charAt(0).toUpperCase() + color.slice(1) : 'None';
  }
}
