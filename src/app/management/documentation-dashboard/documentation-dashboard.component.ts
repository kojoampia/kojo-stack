import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Documentation, DocumentType } from '@app/core/models/documentation.model';
import { DocumentationService } from '@app/core/services/documentation.service';

@Component({
  selector: 'app-documentation-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './documentation-dashboard.component.html',
  styleUrls: ['./documentation-dashboard.component.scss']
})
export class DocumentationDashboardComponent implements OnInit {
  modelName = 'Documentation';
  items: Documentation[] = [];
  filteredItems: Documentation[] = [];
  selectedItem: Documentation | null = null;
  detailItem: Documentation | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  loading = false;
  error: string | null = null;
  selectedType: DocumentType | 'All' = 'All';

  typeOptions: DocumentType[] = ['ADR', 'RFC', 'Manual', 'Policy'];

  formData: Partial<Documentation> = {
    id: '',
    title: '',
    type: 'ADR',
    tags: [],
    lastUpdated: '',
    content: ''
  };

  tagsInput = '';

  constructor(private documentationService: DocumentationService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.documentationService.getDocuments().subscribe({
      next: (items: Documentation[]) => {
        this.items = items;
        this.filterByType();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load documentation: ' + err.message;
        this.loading = false;
      }
    });
  }

  filterByType(): void {
    if (this.selectedType === 'All') {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(d => d.type === this.selectedType);
    }
  }

  onTypeFilterChange(): void {
    this.filterByType();
  }

  selectItem(item: Documentation): void {
    this.selectedItem = item;
  }

  viewItem(item: Documentation): void {
    this.currentAction = 'view';
    this.isViewing = true;
    this.detailItem = item;
    this.error = null;
  }

  createItem(): void {
    this.currentAction = 'create';
    this.isCreating = true;
    this.selectedItem = null;
    this.tagsInput = '';
    this.formData = {
      id: '',
      title: '',
      type: 'ADR',
      tags: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      content: ''
    };
    this.error = null;
  }

  editItem(item: Documentation): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item, tags: [...item.tags] };
    this.tagsInput = item.tags.join(', ');
    this.error = null;
  }

  deleteItem(item: Documentation): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    
    // Parse tags from comma-separated input
    this.formData.tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t);
    this.formData.lastUpdated = new Date().toISOString().split('T')[0];
    
    const doc = { ...this.selectedItem, ...this.formData } as Documentation;

    if (this.isCreating) {
      this.documentationService.createDocument(doc);
      this.loadItems();
      this.cancelAction();
    } else if (this.isUpdating && doc.id) {
      this.documentationService.updateDocument(doc.id, doc);
      this.loadItems();
      this.cancelAction();
    }
    this.loading = false;
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.documentationService.deleteDocument(this.selectedItem.id);
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
    this.tagsInput = '';
  }

  goBack(): void {
    this.cancelAction();
  }

  getTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      'ADR': 'type-adr',
      'RFC': 'type-rfc',
      'Manual': 'type-manual',
      'Policy': 'type-policy'
    };
    return typeClasses[type] || '';
  }

  getTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      'ADR': '📋',
      'RFC': '📝',
      'Manual': '📖',
      'Policy': '📜'
    };
    return typeIcons[type] || '📄';
  }
}
