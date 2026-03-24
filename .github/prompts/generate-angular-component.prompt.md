---
description: "Generate a new standalone Angular component in kojo-stack with proper structure, imports, styling, and integration."
name: "Generate Angular Component"
argument-hint: "Component name, feature area, parent component, and main responsibilities"
agent: "fullstack-engineer"
---
Generate a new standalone Angular component for `kojo-stack` following the project's patterns.

Inputs to infer from the user argument:
- Component name (PascalCase) and feature area
- Purpose and main capabilities (list, details, form, widget)
- Input properties and output events
- Services to inject for data/state
- Styling needs (Tailwind classes, responsive design)
- Route integration if applicable

Implementation rules:
- Create file with PascalCase + `Component` suffix in appropriate feature folder
- Use `standalone: true` and minimal imports
- Apply `ChangeDetectionStrategy.OnPush` for optimization
- Use Angular Signals for component-local state; inject services with BehaviorSubject streams
- Keep template clean with path aliases (`@core/*`, `@shared/*`)
- Use Tailwind exclusively for layout and spacing
- Set up proper cleanup with `destroy$ = new Subject<void>()` and `takeUntil()` pattern
- Bind to service methods and computed values in template
- Add proper TypeScript typing (no `any`)

Output:
1. Component TypeScript file with proper structure
2. Component template (HTML) with Tailwind styling
3. Component styles file (SCSS) if custom overrides needed
4. Barrel export update (`index.ts`) if applicable
5. Integration instructions (route, parent import, etc.)

Validation:
- Component compiles with strict TypeScript
- Selector is kebab-case
- All subscriptions have cleanup
