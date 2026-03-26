import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MetricEntry, MetricService } from '@app/core/services/metric.service';

type MetricCategory = 'Performance' | 'Availability' | 'Business' | 'Security';
type TrendType = 'up' | 'down' | 'stable';

@Component({
  selector: 'app-metric-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './metric-dashboard.component.html',
  styleUrls: ['./metric-dashboard.component.scss']
})
export class MetricDashboardComponent implements OnInit {
  private readonly metricService = inject(MetricService);

  modelName = 'Metric';
  items = signal<MetricEntry[]>([]);
  filteredItems = signal<MetricEntry[]>([]);
  selectedItem: MetricEntry | null = null;
  detailItem: MetricEntry | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  error: string | null = null;
  selectedCategory: MetricCategory | 'All' = 'All';

  categoryOptions: MetricCategory[] = ['Performance', 'Availability', 'Business', 'Security'];
  trendOptions: TrendType[] = ['up', 'down', 'stable'];

  formData: Partial<MetricEntry> = {
    label: '',
    value: '',
    trend: 'stable',
    category: 'Performance',
    description: ''
  };

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.metricService.getMetrics().subscribe({
      next: (items: MetricEntry[]) => {
        this.items.set(items);
        this.filterByCategory();
      },
      error: (err: any) => {
        this.error = 'Failed to load metrics: ' + err.message;
      }
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory === 'All') {
      this.filteredItems.set([...this.items()]);
    } else {
      this.filteredItems.set(this.items().filter(m => m.category === this.selectedCategory));
    }
  }

  onCategoryFilterChange(): void {
    this.filterByCategory();
  }

  selectItem(item: MetricEntry): void {
    this.selectedItem = item;
  }

  viewItem(item: MetricEntry): void {
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
      trend: 'stable',
      category: 'Performance',
      description: ''
    };
    this.error = null;
  }

  editItem(item: MetricEntry): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.isViewing = false;
    this.detailItem = null;
    this.selectedItem = item;
    this.formData = { ...item };
    this.error = null;
  }

  deleteItem(item: MetricEntry): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    const metric = { ...this.selectedItem, ...this.formData } as MetricEntry;

    if (this.isCreating) {
      this.metricService.addMetric(metric).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to create metric';
        }
      });
    } else if (this.isUpdating && metric.id) {
      this.metricService.updateMetric(metric.id, metric).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to update metric';
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.metricService.deleteMetric(this.selectedItem.id).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to delete metric';
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

  getCategoryClass(category: string): string {
    const categoryClasses: { [key: string]: string } = {
      'Performance': 'category-performance',
      'Availability': 'category-availability',
      'Business': 'category-business',
      'Security': 'category-security'
    };
    return categoryClasses[category] || '';
  }

  getTrendClass(trend: string): string {
    const trendClasses: { [key: string]: string } = {
      'up': 'trend-up',
      'down': 'trend-down',
      'stable': 'trend-stable'
    };
    return trendClasses[trend] || '';
  }

  getTrendIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      'up': '↑',
      'down': '↓',
      'stable': '→'
    };
    return icons[trend] || '→';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Performance': '⚡',
      'Availability': '🟢',
      'Business': '📈',
      'Security': '🔒'
    };
    return icons[category] || '📊';
  }
}
