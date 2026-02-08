export type EducationType = 'University Bachelor Education' | 'Pre University School' | 'Secondary Advance Level' | 'Secondary GCE Ordinary Level' | 'Professional Workshop' | 'Professional Study' | 'Certification';

export interface Education {
  id?: string;
  institution: string;
  subjects: string[];
  type: EducationType | string;
  duration: string;
}
