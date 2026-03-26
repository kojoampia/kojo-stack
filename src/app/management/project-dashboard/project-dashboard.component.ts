import { Component, OnInit, inject, signal } from '@angular/core';
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
  private readonly projectService = inject(ProjectService);

  modelName = 'Project';
  items = signal<Project[]>([]);
  selectedItem: Project | null = null;
  detailItem: Project | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  error: string | null = null;

  typeOptions: ProjectType[] = ['ARCHITECTURE', 'MICROSERVICES', 'DEVOPS', 'BACKEND_SERVICE', 'FRONTEND', 'FULL_STACK', 'DATA_ENGINEERING', 'CONSULTING', 'MIGRATION', 'ETL', 'MONITORING', 'TRANSFORMATION'];
  statusOptions: ProjectStatus[] = ['LIVE', 'COMPLETED', 'MAINTENANCE', 'PENDING'];

  formData: Partial<Project> = {
    name: '',
    client: '',
    type: 'MICROSERVICES',
    description: '',
    stack: [],
    status: 'PENDING',
    architecture: ''
  };

  stackInput = '';

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.projectService.getProjects().subscribe({
      next: (items: Project[]) => {
        this.items.set(items);
      },
      error: (err: any) => {
        this.error = 'Failed to load projects: ' + err.message;
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
      type: 'MICROSERVICES',
      description: '',
      stack: [],
      status: 'PENDING',
      architecture: ''
    };
    this.error = null;
  }

  editItem(item: Project): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.isViewing = false;
    this.detailItem = null;
    this.selectedItem = item;
    this.formData = { ...item, stack: [...(item.stack || [])] };
    this.stackInput = (item.stack || []).join(', ');
    this.error = null;
  }

  deleteItem(item: Project): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    // Parse stack from comma-separated input
    this.formData.stack = this.stackInput.split(',').map(s => s.trim()).filter(s => s);
    
    const project = { ...this.selectedItem, ...this.formData } as Project;

    if (this.isCreating) {
      this.projectService.addProject(project).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to create project';
        }
      });
    } else if (this.isUpdating && project.id) {
      this.projectService.updateProject(project.id, project).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to update project';
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.projectService.deleteProject(this.selectedItem.id).subscribe({
        next: () => {
          this.cancelAction();
          this.loadItems();
        },
        error: () => {
          this.error = 'Failed to delete project';
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
      'MICROSERVICES': 'type-microservices',
      'MONOLITH': 'type-monolith',
      'MIGRATION': 'type-migration',
      'DEVOPS': 'type-devops',
      'ARCHITECTURE': 'type-architecture',
      'ETL': 'type-etl',
      'MONITORING': 'type-monitoring'
    };
    return typeClasses[type] || '';
  }
}
