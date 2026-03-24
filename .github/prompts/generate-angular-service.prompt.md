---
description: "Generate an Angular service in kojo-stack with HTTP calls, state management, and Observable patterns."
name: "Generate Angular Service"
argument-hint: "Service name, data model, API endpoint, and state/cache requirements"
agent: "fullstack-engineer"
---
Generate a new Angular service for `kojo-stack` with proper HTTP integration and state management.

Inputs to infer from the user argument:
- Service name (PascalCase + Service suffix)
- Data model/interface it manages
- API endpoint path under `/api/v1/**`
- CRUD operations needed (read list, get one, create, update, delete)
- Caching or state requirements (cache all? invalidate on change?)
- Dependent services (e.g., AccountService for auth context)

Implementation rules:
- Create in `src/app/core/services/` for cross-feature services or in feature folder for feature-specific services
- Use `@Injectable({ providedIn: 'root' })`
- Return `Observable<T>` for all methods; expose BehaviorSubject via `.asObservable()`
- Apply `shareReplay()` to HTTP calls to prevent duplicate requests
- Use `tap()` for side effects like cache updates; use `catchError()` for error handling
- Type all parameters and return values explicitly (no `any`)
- For list endpoints, consider pagination and filtering parameters
- Add proper interface types in `src/app/core/models/`
- Update `src/app/core/services/index.ts` barrel export

Output:
1. Service TypeScript file with CRUD methods
2. Optional: Model/interface file with proper typing
3. Barrel export updates
4. Component integration example showing subscription pattern
5. Assumptions about API contracts and pagination

Validation:
- All HTTP calls use proper error handling
- Observables use `shareReplay()` where caching helps
- Service is properly typed with no `any` types
