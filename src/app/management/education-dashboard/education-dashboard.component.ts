import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Education, EducationType } from '@app/core/models/education.model';
import { EducationService } from '@app/core/services/education.service';

@Component({
  selector: 'app-education-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './education-dashboard.component.html',
  styleUrls: ['./education-dashboard.component.scss']
})
export class EducationDashboardComponent implements OnInit {
  modelName = 'Education';
  filteredItems: Education[] = [];
  selectedItem: Education | null = null;
  detailItem: Education | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  loading = false;
  error: string | null = null;
  selectedType: string = 'All';

  typeOptions: string[] = [
    'University Bachelor Education',
    'Pre University School',
    'Secondary Advance Level',
    'Secondary GCE Ordinary Level',
    'Professional Workshop',
    'Professional Study',
    'Certification'
  ];

  formData: Partial<Education> = {
    institution: '',
    subjects: [],
    type: 'University Bachelor Education',
    duration: ''
  };

  subjectsInput = '';
  education = signal<Education[]>([]);

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    this.loadEducation();
  }

  loadEducation(): void {
    this.loading = true;
    this.educationService.getAll().subscribe({
      next: (education) => {
        if (education && education.length > 0) {
          this.education.set(education);
          this.filterByType();
          this.loading = false;
        } else {
          this.loadMockEducation();
        }
      },
      error: () => {
        this.loadMockEducation();
      }
    });
  }

  loadMockEducation(): void {
    this.educationService.getEducation().subscribe(education => {
      this.education.set(education);
      this.filterByType();
      this.loading = false;
    });
  }

  filterByType(): void {
    if (this.selectedType === 'All') {
      this.filteredItems = [...this.education()];
    } else {
      this.filteredItems = this.education().filter(e => e.type === this.selectedType);
    }
  }

  onTypeChange(): void {
    this.filterByType();
  }

  selectItem(item: Education): void {
    this.selectedItem = item;
  }

  viewItem(item: Education): void {
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
      institution: '',
      subjects: [],
      type: 'University Bachelor Education',
      duration: ''
    };
    this.subjectsInput = '';
    this.error = null;
  }

  editItem(item: Education): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item };
    this.subjectsInput = item.subjects?.join(', ') || '';
    this.error = null;
  }

  deleteItem(item: Education): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    
    // Parse subjects from comma-separated string
    this.formData.subjects = this.subjectsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const education = { ...this.formData } as Education;

    if (this.isCreating) {
      this.educationService.create(education).subscribe({
        next: () => {
          this.loadEducation();
          this.cancelAction();
        },
        error: (err) => {
          this.error = 'Failed to create education record';
          this.loading = false;
        }
      });
    } else if (this.isUpdating && this.selectedItem?.id) {
      this.educationService.update(this.selectedItem.id, education).subscribe({
        next: () => {
          this.loadEducation();
          this.cancelAction();
        },
        error: (err) => {
          this.error = 'Failed to update education record';
          this.loading = false;
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?.id) {
      this.loading = true;
      this.educationService.delete(this.selectedItem.id).subscribe({
        next: () => {
          this.loadEducation();
          this.cancelAction();
        },
        error: (err) => {
          this.error = 'Failed to delete education record';
          this.loading = false;
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
    this.subjectsInput = '';
    this.loading = false;
  }

  getTypeClass(type: string): string {
    if (type.includes('University') || type.includes('Bachelor')) return 'type-university';
    if (type.includes('Pre University')) return 'type-preuni';
    if (type.includes('Secondary')) return 'type-secondary';
    if (type.includes('Professional') || type.includes('Workshop')) return 'type-professional';
    if (type.includes('Certification')) return 'type-certification';
    return 'type-default';
  }

  getTypeIcon(type: string): string {
    if (type.includes('University') || type.includes('Bachelor')) return '🎓';
    if (type.includes('Pre University')) return '📚';
    if (type.includes('Secondary')) return '🏫';
    if (type.includes('Professional') || type.includes('Workshop')) return '💼';
    if (type.includes('Certification')) return '📜';
    return '📖';
  }
}
