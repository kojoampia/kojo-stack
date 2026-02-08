import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Project, ProjectType, ProjectStatus } from '@app/core/models/project.model';
import { ProjectService } from '@app/core/services/project.service';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit {
  modelName = 'Project';
  items: Project[] = [];
  selectedItem: Project | null = null;
  detailItem: Project | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  loading = false;
  error: string | null = null;

  typeOptions: ProjectType[] = ['Microservices', 'Monolith', 'Migration', 'DevOps', 'Architecture', 'ETL', 'Monitoring'];
  statusOptions: ProjectStatus[] = ['Live', 'Completed', 'Maintenance', 'Pending'];

  formData: Partial<Project> = {
    name: '',
    client: '',
    type: 'Microservices',
    description: '',
    stack: [],
    status: 'Pending',
    architecture: ''
  };

  stackInput = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (items: Project[]) => {
        this.items = items;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load projects: ' + err.message;
        this.loading = false;
      }
    });
  }

  selectItem(item: Project): void {
    this.selectedItem = item;
  }

  viewItem(item: Project): void {
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
      name: '',
      client: '',
      type: 'Microservices',
      description: '',
      stack: [],
      status: 'Pending',
      architecture: ''
    };
    this.error = null;
  }

  editItem(item: Project): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item, stack: [...item.stack] };
    this.stackInput = item.stack.join(', ');
    this.error = null;
  }

  deleteItem(item: Project): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    
    // Parse stack from comma-separated input
    this.formData.stack = this.stackInput.split(',').map(s => s.trim()).filter(s => s);
    
    const project = { ...this.selectedItem, ...this.formData } as Project;

    if (this.isCreating) {
      this.projectService.addProject(project);
      this.loadItems();
      this.cancelAction();
    } else if (this.isUpdating && project.id) {
      this.projectService.updateProject(project.id, project);
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
      'Live': 'badge-success',
      'Completed': 'badge-info',
      'Maintenance': 'badge-warning',
      'Pending': 'badge-default'
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
