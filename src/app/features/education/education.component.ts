import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationService } from '@app/core/services/education.service';
import { Education } from '@app/core/models/education.model';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  education = signal<Education[]>([]);
  selectedType = signal<string>('All');
  
  educationTypes = computed(() => {
    const types = new Set(this.education().map(e => e.type));
    return ['All', ...Array.from(types)];
  });

  filteredEducation = computed(() => {
    if (this.selectedType() === 'All') {
      return this.education();
    }
    return this.education().filter(e => e.type === this.selectedType());
  });

  formalEducation = computed(() => 
    this.education().filter(e => 
      e.type.includes('University') || 
      e.type.includes('Secondary') || 
      e.type.includes('Pre University')
    )
  );

  professionalEducation = computed(() => 
    this.education().filter(e => 
      e.type.includes('Professional') || 
      e.type.includes('Workshop') ||
      e.type.includes('Certification')
    )
  );

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    this.educationService.getAll().subscribe({
      next: (education) => {
        if (education && education.length > 0) {
          this.education.set(education);
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
    });
  }

  filterByType(type: string): void {
    this.selectedType.set(type);
  }

  getTypeIcon(type: string): string {
    if (type.includes('University') || type.includes('Bachelor')) return 'fa-graduation-cap';
    if (type.includes('Pre University')) return 'fa-book-open';
    if (type.includes('Secondary')) return 'fa-school';
    if (type.includes('Professional') || type.includes('Workshop')) return 'fa-certificate';
    if (type.includes('Certification')) return 'fa-award';
    return 'fa-book';
  }

  getTypeColor(type: string): string {
    if (type.includes('University') || type.includes('Bachelor')) return 'text-purple-500';
    if (type.includes('Pre University')) return 'text-blue-500';
    if (type.includes('Secondary')) return 'text-green-500';
    if (type.includes('Professional') || type.includes('Workshop')) return 'text-orange-500';
    if (type.includes('Certification')) return 'text-yellow-500';
    return 'text-cyan-500';
  }

  getTypeBgColor(type: string): string {
    if (type.includes('University') || type.includes('Bachelor')) return 'bg-purple-500/10 border-purple-500/30';
    if (type.includes('Pre University')) return 'bg-blue-500/10 border-blue-500/30';
    if (type.includes('Secondary')) return 'bg-green-500/10 border-green-500/30';
    if (type.includes('Professional') || type.includes('Workshop')) return 'bg-orange-500/10 border-orange-500/30';
    if (type.includes('Certification')) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-cyan-500/10 border-cyan-500/30';
  }
}
