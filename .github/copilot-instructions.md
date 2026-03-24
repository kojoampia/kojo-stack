# Project Guidelines

## Build And Test
- Use `npm start` or `ng serve` for local development on `http://localhost:4200` (auto-reload enabled).
- Use `npm run build` for development builds to `dist/kojo-stack/`.
- Use `npm run build:prod` for production builds with optimization and hash-based file names.
- Use `npm test` to run Karma/Jasmine unit tests in watch mode.
- Use `npm run lint` to check code quality with ESLint.
- The backend API defaults to `http://localhost:8085` in development and relative requests in production.

## Architecture
- All components use `standalone: true`; avoid NgModules.
- Organize code by feature: `core/` for singletons and auth, `features/` for lazily-loaded routes, `shared/` for reusables, `management/` for admin-only areas.
- Use route guards (`UserRouteAccessService`) to restrict admin routes to users with `ROLE_ADMIN`.
- Keep business logic in services (`@Injectable({ providedIn: 'root' })`); keep components focused on template, state binding, and delegating to services.
- Use barrel exports (`index.ts`) to keep imports clean within features.

## State Management
- Prefer Angular Signals (`signal<T>()`, `computed()`) for component-local state.
- Use `BehaviorSubject` with `asObservable()` in services for app-wide or feature-level state.
- Use RxJS patterns: `shareReplay()` to cache HTTP results, `tap()` for side effects, `catchError()` for error handling.
- Clean up subscriptions in `ngOnDestroy` using the `destroy$ = new Subject<void>()` pattern with `takeUntil()`.

## Styling
- Use Tailwind CSS exclusively for layout, spacing, colors, and responsive design.
- All custom CSS lives in component `.scss` files; keep component stylesheets focused on local overrides only.
- Do not override Tailwind colors or add new classes outside `tailwind.config.js`; extend the config there.
- Respect the dark theme: `bg-slate-950`, `bg-slate-900`, `text-slate-100` are primary colors.
- Use responsive prefixes (`md:`, `lg:`) for breakpoint-specific styling.

## Conventions
- Component names: PascalCase + `Component` suffix (e.g., `DashboardComponent`, `ProjectCardComponent`).
- Service names: PascalCase + `Service` suffix (e.g., `ProjectService`, `AccountService`).
- Model/interface names: PascalCase (e.g., `Project`, `UserProfile`, `Experience`).
- File names: kebab-case (e.g., `project-service.ts`, `dashboard-component.ts`).
- Selector names: kebab-case (e.g., `app-sidebar`, `app-header`).
- Use `ChangeDetectionStrategy.OnPush` on all components to optimize change detection.
- Inject services via constructor; do not use property decorators like `@Input` for service dependencies.
- Import using path aliases: `@core/*`, `@features/*`, `@shared/*`, `@assets/*`, `@env/*`.

## Key Files
- `src/main.ts` — Bootstrap entry point; defines providers and HTTP interceptor chain.
- `src/app/app.component.ts` — Root component; layout shell with sidebar, header, router outlet, footer.
- `src/app/app.routes.ts` — Route definitions; feature-based routes and admin guardrails.
- `src/app/app.constants.ts` — Global constants: API URL, version, feature flags.
- `src/app/core/auth/account.service.ts` — Auth identity and role checking.
- `src/app/core/auth/user-route-access-service.ts` — Route guard for role-based access.
- `src/app/core/interceptors/*.ts` — HTTP interceptors: auth, trace IDs, error handling, notifications.
- `src/app/core/services/*.ts` — Feature services (Project, Experience, Documentation, etc.).
- `src/environments/environment.ts` and `environment.prod.ts` — Environment-specific config.
- `angular.json` — Build/serve/test configuration; output paths, budgets, style defaults.
- `tsconfig.json` — TypeScript options; path aliases, strict mode, target ES2022.
- `tailwind.config.js` — Tailwind theme extensions.
- `nginx.conf` — Production Nginx config; SPA routing and security headers.

## Known Pitfalls
- Do not use `ViewChild` for cross-component communication; use services and RxJS Observables instead.
- Avoid `ngOnInit` without cleanup; always unsubscribe or use `takeUntil(destroy$)` pattern.
- Do not mutate data directly on component state; use `.next()` or signal setter when updating BehaviorSubjects and signals.
- The backend URL is `http://localhost:8085` in development. Check `app.constants.ts` and `environment.ts` when the API appears unreachable.
- Strict TypeScript mode is ON; do not try to work around type errors; fix them properly to maintain compile-time safety.
- Path aliases must exist in `tsconfig.json` and are case-sensitive; use `@core/*`, not `@CORE/*`.
- Tailwind cache may require `npm run build` or manual cache clear if new classes are added; it only scans `src/**/*.{html,ts}`.
