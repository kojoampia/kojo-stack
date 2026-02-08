import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ModelAction {
  type: 'list' | 'create' | 'update' | 'delete';
  label: string;
  icon: string;
}

@Component({
  selector: 'app-model-dashboard-base',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ''
})
export class ModelDashboardBase implements OnInit {
  modelName = 'Model';
  items: any[] = [];
  selectedItem: any = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' = 'list';

  actions: ModelAction[] = [
    { type: 'list', label: 'List', icon: 'list' },
    { type: 'create', label: 'Create', icon: 'add' },
    { type: 'update', label: 'Edit', icon: 'edit' },
    { type: 'delete', label: 'Delete', icon: 'delete' }
  ];

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    // To be implemented by child components
  }

  selectItem(item: any): void {
    this.selectedItem = item;
  }

  createItem(): void {
    this.currentAction = 'create';
    this.isCreating = true;
    this.selectedItem = null;
  }

  editItem(item: any): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = { ...item };
  }

  deleteItem(item: any): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
  }

  saveItem(): void {
    // To be implemented by child components
  }

  confirmDelete(): void {
    // To be implemented by child components
  }

  cancelAction(): void {
    this.currentAction = 'list';
    this.isCreating = false;
    this.isUpdating = false;
    this.isDeleting = false;
    this.selectedItem = null;
  }

  goBack(): void {
    this.cancelAction();
  }
}
