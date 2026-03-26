import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
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
  private readonly documentationService = inject(DocumentationService);

  modelName = 'Documentation';
  items = signal<Documentation[]>([]);
  filteredItems = signal<Documentation[]>([]);
  selectedItem: Documentation | null = null;
  detailItem: Documentation | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
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

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.documentationService.getDocuments().subscribe({
      next: (items: Documentation[]) => {
        this.items.set(items);
        this.filterByType();
      },
      error: (err: any) => {
        this.error = 'Failed to load documentation: ' + err.message;
      }
    });
  }

  filterByType(): void {
    if (this.selectedType === 'All') {
      this.filteredItems.set([...this.items()]);
    } else {
      this.filteredItems.set(this.items().filter(d => d.type === this.selectedType));
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
    this.isViewing = false;
    this.detailItem = null;
    this.selectedItem = item;
    this.formData = { ...item, tags: [...(item.tags || [])] };
    this.tagsInput = (item.tags || []).join(', ');
    this.error = null;
  }

  deleteItem(item: Documentation): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    // Parse tags from comma-separated input
    this.formData.tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t);
    this.formData.lastUpdated = new Date().toISOString().split('T')[0];
    
    const doc = { ...this.selectedItem, ...this.formData } as Documentation;

    let save$: Observable<Documentation> | null = null;
    if (this.isCreating) {
      save$ = this.documentationService.createDocument(doc);
    } else if (this.isUpdating && doc.id) {
      save$ = this.documentationService.updateDocument(doc.id, doc);
    }

    if (!save$) {
      return;
    }

    save$.subscribe({
      next: () => {
        this.cancelAction();
        this.loadItems();
      },
      error: (err: any) => {
        this.error = 'Failed to save documentation: ' + err.message;
      }
    });
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.documentationService.deleteDocument(this.selectedItem.id).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: (err: any) => {
          this.error = 'Failed to delete documentation: ' + err.message;
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