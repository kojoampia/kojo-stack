import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TechSkill, SkillCategory } from '@app/core/models/tech-skill.model';
import { SkillsService } from '@app/core/services/skills.service';

@Component({
  selector: 'app-skill-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './skill-dashboard.component.html',
  styleUrls: ['./skill-dashboard.component.scss']
})
export class SkillDashboardComponent implements OnInit {
  modelName = 'Skill';
  filteredItems: TechSkill[] = [];
  selectedItem: TechSkill | null = null;
  detailItem: TechSkill | null = null;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  isViewing = false;
  currentAction: 'list' | 'create' | 'update' | 'delete' | 'view' = 'list';
  loading = false;
  error: string | null = null;
  selectedCategory: SkillCategory | 'All' = 'All';

  categoryOptions: SkillCategory[] = ['Backend', 'Frontend', 'DevOps', 'Data'];

  formData: Partial<TechSkill> = {
    name: '',
    category: 'Backend',
    level: 50,
    icon: ''
  };
  skills = signal<TechSkill[] | []> ([]);

  constructor(private skillsService: SkillsService) {}



  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.skillsService.getAll().subscribe(skills => {
      if (skills && skills.length > 0) {
        this.skills.set(skills);
        this.filterByCategory();
        this.loading = false;
      } else {
        this.loadMockSkills();
      }
    });
  }

  loadMockSkills(): void {
    this.skillsService.getSkills().subscribe(skills => {
      this.skills.set(skills);
      this.filterByCategory();
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory === 'All') {
      this.filteredItems = [...this.skills()];
    } else {
      this.filteredItems = this.skills().filter(s => s.category === this.selectedCategory);
    }
  }

  onCategoryChange(): void {
    this.filterByCategory();
  }

  selectItem(item: TechSkill): void {
    this.selectedItem = item;
  }

  viewItem(item: TechSkill): void {
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
      category: 'Backend',
      level: 50,
      icon: ''
    };
    this.error = null;
  }

  editItem(item: TechSkill): void {
    this.currentAction = 'update';
    this.isUpdating = true;
    this.selectedItem = item;
    this.formData = { ...item };
    this.error = null;
  }

  deleteItem(item: TechSkill): void {
    this.currentAction = 'delete';
    this.isDeleting = true;
    this.selectedItem = item;
    this.error = null;
  }

  saveItem(): void {
    this.loading = true;
    
    const skill = { ...this.formData } as TechSkill;

    if (this.isCreating) {
      this.skillsService.createSkill(skill);
      this.loadSkills();
      this.cancelAction();
    } else if (this.isUpdating && this.selectedItem) {
      this.skillsService.updateSkill(this.selectedItem.name, skill);
      this.loadSkills();
      this.cancelAction();
    }
    this.loading = false;
  }

  confirmDelete(): void {
    this.cancelAction();
    this.loadSkills();
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
      'Backend': 'category-backend',
      'Frontend': 'category-frontend',
      'DevOps': 'category-devops',
      'Data': 'category-data'
    };
    return categoryClasses[category] || '';
  }

  getLevelClass(level: number): string {
    if (level >= 90) return 'level-expert';
    if (level >= 70) return 'level-advanced';
    if (level >= 50) return 'level-intermediate';
    return 'level-beginner';
  }
}
