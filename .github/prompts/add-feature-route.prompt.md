---
description: "Add a new feature route and lazy-loaded component in kojo-stack with proper path setup and role-based guards."
name: "Add Feature Route"
argument-hint: "Route path, component name, feature area, admin-only flag, and parent route"
agent: "fullstack-engineer"
---
Add a new feature route to `kojo-stack` with lazy-loaded component and proper access control.

Inputs to infer from the user argument:
- Route path (e.g., `/projects`, `/hire`, `/settings`)
- Feature area folder path
- Component name to load
- Whether the route requires `ROLE_ADMIN` (for management routes)
- Parent route (if nested under `/management` or main routes)

Implementation rules:
- Create feature folder if needed under `src/app/features/` or `src/app/management/`
- Add lazy-loaded component route to `src/app/app.routes.ts`
- Use `loadComponent: () => import(...).then(...)` pattern for lazy loading
- For admin routes, apply `canActivate: [UserRouteAccessService]` guard
- Ensure route path follows kebab-case convention
- Update any shared navigation lists (sidebar, menu)
- Keep routes flat and path-based; avoid deeply nested routing

Output:
1. Updated route definition in `app.routes.ts`
2. Feature component and folder structure
3. Navigation integration (sidebar/menu updates if needed)
4. Access control configuration (admin guard if applicable)
5. Example usage in templates

Validation:
- Route lazy-loads correctly on navigation
- Admin guard restricts access properly
- Component imports work with path aliases
