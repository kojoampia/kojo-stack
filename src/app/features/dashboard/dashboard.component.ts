import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceService, SkillsService } from '@app/core/services';
import { Experience, SkillCategory, TechSkill} from '@app/core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly experienceService = inject(ExperienceService);
  private readonly skillsService = inject(SkillsService);

  experiences = signal<Experience[]>([]);
  projectCount = computed(() => this.experiences().length);
  categories: SkillCategory[] = ['Backend', 'DevOps', 'Frontend', 'Data'];
  techSkills = signal<TechSkill[]>([]);

  ngOnInit(): void {     
    this.experienceService.getExperiences().subscribe(exps => {
      if (exps && exps.length > 0) {
        this.experiences.set(exps);
      }
    });
    this.skillsService.getAll().subscribe(skills => {
      if (skills && skills.length > 0) {
        this.techSkills.set(skills);
        this.setSkillCategories();
      }
    });
  }

  setSkillCategories(): void {
    this.categories = this.techSkills().reduce((acc, skill) => {
      if (!acc.includes(skill.category)) {
        acc.push(skill.category);
      }
      return acc;
    }, [] as SkillCategory[]);
  }


  getSkillsByCategory(category: SkillCategory) {
    return this.techSkills().filter(skill => skill.category === category);
  }
}
