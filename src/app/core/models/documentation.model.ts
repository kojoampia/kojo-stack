export type DocumentType = 'ADR' | 'RFC' | 'Manual' | 'Policy';

export interface Documentation {
  id: string;
  title: string;
  type: DocumentType;
  tags: string[];
  lastUpdated: string;
  content: string;
}
