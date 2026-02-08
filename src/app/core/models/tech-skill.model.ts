export type SkillCategory = 'Backend' | 'Frontend' | 'DevOps' | 'Data';

export interface TechSkill {
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  icon: string;
}
