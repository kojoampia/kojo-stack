import { Component, OnInit, signal, computed } from '@angular/core';
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
  experiences = signal<Experience[]>([]);
  projectCount = computed(() => this.experiences().length);
  categories: SkillCategory[] = ['Backend', 'DevOps', 'Frontend', 'Data'];
  techSkills = signal<TechSkill[]>([]);


  constructor(
    private experienceService: ExperienceService,
    private skillsService: SkillsService,
  ) {}

  ngOnInit(): void {     
    this.experienceService.getExperiences().subscribe(exps => {
      if (exps && exps.length > 0) {
        this.experiences.set(exps);
      } else {
        this.loadMockExperiences();  
      }
    });
    this.skillsService.getAll().subscribe(skills => {
      if (skills && skills.length > 0) {
        this.techSkills.set(skills);
        this.setSkillCategories();
      } else {
        this.loadMockSkills();
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


  loadMockSkills(): void {
    this.skillsService.getSkills().subscribe(skills => {
      this.techSkills.set(skills);
      this.setSkillCategories();
    });
  }

  loadMockExperiences(): void {
    this.experienceService.fetchExperiences().subscribe(exps => {
      this.experiences.set(exps);
    });
  }

  getSkillsByCategory(category: SkillCategory) {
    return this.techSkills().filter(skill => skill.category === category);
  }
}
