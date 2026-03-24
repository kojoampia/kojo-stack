---
description: "Use when creating, updating, or reviewing Angular components, templates, and UI logic in kojo-stack."
name: "Frontend Component Guidelines"
applyTo: "src/app/**/*.component.ts"
---
# Frontend Component Guidelines

- All components must use `standalone: true` and avoid NgModule dependencies.
- Use `ChangeDetectionStrategy.OnPush` on every component to optimize detection and enable clear signal/Observable usage patterns.
- Keep components focused on template binding, event handling, and delegation to services; move business logic to services.
- Prefer Angular Signals (`signal<T>()`, `computed()`) for component-local state over BehaviorSubjects.
- Use `RxJS` with `takeUntil(destroy$)` pattern for all Observable subscriptions; always clean up in `ngOnDestroy`.
- Inject services via constructor using Signals or Observable streams; do not use `@Input/@Output` for service dependencies.
- Keep templates clean: use `{{ }}` interpolation for display, `(event)="handler()"` for events, `[property]="value"` for binding, and `*ngIf`, `*ngFor`, `*ngSwitch` for structure.
- Use Angular Material only for specific components (e.g., spinners); rely on Tailwind CSS for layout, spacing, and theme.
- Validate inputs with strong TypeScript typing; avoid `any` types even in templates.
- Apply `@core/*`, `@features/*`, `@shared/*` path aliases consistently when importing.
- Verify that selector names follow kebab-case (e.g., `app-sidebar`, `app-card`).
- For routes protected by admin role, verify they use `UserRouteAccessService` guard with `ROLE_ADMIN` check.
