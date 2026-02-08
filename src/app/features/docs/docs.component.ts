import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationService } from '@app/core/services';
import { Documentation } from '@app/core/models';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  docs = signal<Documentation[]>([]);
  selectedDoc = signal<Documentation | null>(null);

  constructor(private docsService: DocumentationService) {}

  ngOnInit(): void {
    this.docsService.getDocuments().subscribe(docs => {
      this.docs.set(docs);
      this.selectedDoc.set(docs[0]);
    });
  }
}
