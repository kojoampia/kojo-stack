import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectType } from '@app/core/models/project.model';
import { Inquiry, InquiryService } from '@app/core/services/inquiry.service';

type InquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed';

@Component({
  selector: 'app-inquiry-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inquiry-dashboard.component.html',
  styleUrls: ['./inquiry-dashboard.component.scss']
})
export class InquiryDashboardComponent implements OnInit {
  modelName = 'Inquiry';
  items: Inquiry[] = [];
  filteredItems: Inquiry[] = [];
  selectedItem: Inquiry | null = null;
  detailItem: Inquiry | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  loading = false;
  error: string | null = null;
  selectedStatus: InquiryStatus | 'All' = 'All';

  typeOptions: ProjectType[] = ['Microservices', 'Monolith', 'Migration', 'DevOps', 'Architecture', 'ETL', 'Monitoring'];
  statusOptions: InquiryStatus[] = ['New', 'Contacted', 'In Progress', 'Closed'];

  formData: Partial<Inquiry> = {
    name: '',
    email: '',
    type: 'Microservices',
    message: '',
    status: 'New'
  };

  constructor(private inquiryService: InquiryService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.inquiryService.getInquiries().subscribe({
      next: (items: Inquiry[]) => {
        this.items = items;
        this.filterByStatus();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load inquiries: ' + err.message;
        this.loading = false;
      }
    });
  }

  filterByStatus(): void {
    if (this.selectedStatus === 'All') {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(i => i.status === this.selectedStatus);
    }
  }

  onStatusFilterChange(): void {
    this.filterByStatus();
  }

  selectItem(item: Inquiry): void {
    this.selectedItem = item;
  }

  viewItem(item: Inquiry): void {
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
      name: '',
      email: '',
      type: 'Microservices',
      message: '',
      status: 'New'
    };
    this.error = null;
  }

  editItem(item: Inquiry): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item };
    this.error = null;
  }

  deleteItem(item: Inquiry): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    
    const inquiry = { ...this.selectedItem, ...this.formData } as Inquiry;

    if (this.isCreating) {
      this.inquiryService.createInquiry(inquiry);
      this.loadItems();
      this.cancelAction();
    } else if (this.isUpdating && inquiry.id) {
      this.inquiryService.updateInquiry(inquiry.id, inquiry);
      this.loadItems();
      this.cancelAction();
    }
    this.loading = false;
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.inquiryService.deleteInquiry(this.selectedItem.id);
      this.loadItems();
    }
    this.cancelAction();
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

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'New': 'badge-new',
      'Contacted': 'badge-contacted',
      'In Progress': 'badge-progress',
      'Closed': 'badge-closed'
    };
    return statusClasses[status] || 'badge-default';
  }

  getTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      'Microservices': 'type-microservices',
      'Monolith': 'type-monolith',
      'Migration': 'type-migration',
      'DevOps': 'type-devops',
      'Architecture': 'type-architecture',
      'ETL': 'type-etl',
      'Monitoring': 'type-monitoring'
    };
    return typeClasses[type] || '';
  }
}
