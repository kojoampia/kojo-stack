---
description: "Use when creating or updating services, state management, HTTP calls, or observable patterns in kojo-stack."
name: "Frontend Services and State Guidelines"
applyTo: "src/app/**/*.service.ts"
---
# Frontend Services and State Guidelines

- All services use `@Injectable({ providedIn: 'root' })` for singleton-scoped dependency injection; avoid providers arrays.
- For app-wide state, use `BehaviorSubject` with `.asObservable()` to expose read-only Observable streams to consumers.
- For HTTP calls, apply `shareReplay()` to cache results and prevent duplicate requests; combine with `tap()` for side effects (like state updates) and `catchError()` for error handling.
- Keep service responsibility clear: API calls, data transformation, state management belong in services; template logic belongs in components.
- Return `Observable<T>` from service methods instead of Promises; let consumers subscribe with `takeUntil(destroy$)` cleanup.
- Group services by feature domain: `src/app/core/services/` for global/cross-feature services, feature-specific services near their components.
- Use barrel exports (`index.ts`) to expose service interfaces and keep imports simple throughout the app.
- When caching HTTP results, consider TTL and invalidation strategy; coordinate with component signals or BehaviorSubject updates.
- Avoid direct mutation of service state; use `.next()` or signal setter with immutable update patterns.
- Type all service methods and Observable returns explicitly; never use `any` for HTTP response types.
- If a service depends on another service (e.g., AccountService for auth context), inject it via constructor and document the dependency.
