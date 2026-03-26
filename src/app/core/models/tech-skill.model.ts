export type SkillCategory = 'Backend' | 'Frontend' | 'DevOps' | 'Data';

export interface TechSkill {
  id?: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  icon: string;
}
