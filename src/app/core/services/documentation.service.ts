import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Documentation } from '../models/documentation.model';
import { SERVER_API_URL } from '@app/app.constants';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  private docs$ = new BehaviorSubject<Documentation[]>([
    {
      id: 'ADR-2024-001',
      title: 'Event-Driven Architecture Strategy',
      type: 'ADR',
      tags: ['Kafka', 'Microservices', 'Abofonsa'],
      lastUpdated: '2024-03-15',
      content: `
# Context
For the Abofonsa Mobile Health Service, we require a near-real-time communication brokerage platform. The current polling mechanism causes latency and database contention.

# Decision
We will implement an Event-Driven Architecture using Apache Kafka.

## Key Components
1. **Producer:** Mobile App Gateways publishing "HealthEvent" topics.
2. **Broker:** Kafka Cluster (3 nodes) for persistence and reliability.
3. **Consumer:** Analytics Service and Alerting Service.

# Consequences
* **Positive:** Latency reduced from seconds to milliseconds. Decoupled services.
* **Negative:** Increased operational complexity (Zookeeper/Kafka management).
* **Mitigation:** Use Managed Kafka or Strimzi Operator on Kubernetes.
      `
    },
    {
      id: 'SEC-POL-003',
      title: 'OWASP Top 10 Mitigation Strategy',
      type: 'Policy',
      tags: ['Security', 'Spring Boot', 'Bedrock'],
      lastUpdated: '2022-11-20',
      content: `
# Policy Statement
All public-facing portals for Bedrock Insurance must comply with OWASP Top 10 standards.

# Implementation Guidelines

## 1. Injection (A03:2021)
* Use Prepared Statements (JPA/Hibernate) for all SQL queries.
* Validate all inputs using a strict whitelist.

## 2. Broken Access Control (A01:2021)
* Implement Role-Based Access Control (RBAC) using Spring Security.
* Enforce object-level authorization (e.g., users can only see their own policies).

## 3. Cryptographic Failures (A02:2021)
* Enforce TLS 1.3 for all traffic.
* Encrypt PII (Personally Identifiable Information) at rest using AES-256.
      `
    },
    {
      id: 'OPS-MAN-002',
      title: 'OpenShift Migration Playbook',
      type: 'Manual',
      tags: ['DevOps', 'OpenShift', 'Accenture'],
      lastUpdated: '2023-06-10',
      content: `
# Overview
Standard operating procedure for migrating legacy Java applications to OpenShift PaaS.

# Phase 1: Containerization
1.  Create \`Dockerfile\` based on \`openjdk:17-slim\`.
2.  Optimize layers (copy dependencies before source).
3.  Add non-root user for security compliance.

# Phase 2: Helm Chart Creation
1.  Define \`Deployment\`, \`Service\`, and \`Route\` resources.
2.  Externalize configurations to \`ConfigMap\` and \`Secret\`.
3.  Implement \`LivenessProbe\` and \`ReadinessProbe\` endpoints.

# Phase 3: Observability
1.  Enable ServiceMonitor for Prometheus scraping.
2.  Verify logs are shipping to LGTM | ELK stack.
      `
    }
  ]);

  readonly apiUrl = `${SERVER_API_URL}/api/v1/docs`;
  readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  getDocuments(): Observable<Documentation[]> {
    return this.http.get<Documentation[]>(this.apiUrl);
  }

  createDocument(doc: Documentation): Observable<Documentation> {
    return this.http.post<Documentation>(this.apiUrl, doc);
  }

  updateDocument(id: string, doc: Documentation): Observable<Documentation> {
    return this.http.put<Documentation>(`${this.apiUrl}/${id}`, doc);
  }

  getDocumentById(id: string): Observable<Documentation> {
    return this.http.get<Documentation>(`${this.apiUrl}/${id}`);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
