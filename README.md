# Kojo Stack - Production Ready Angular Application

Professional portfolio and consulting platform for Senior Software Architect & DevOps Engineer.

## Architecture Overview

### Directory Structure

```
src/
├── app/
│   ├── core/                    # Core application logic
│   │   ├── models/              # Data models & interfaces
│   │   └── services/            # Business logic services
│   ├── features/                # Feature modules
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── docs/
│   │   ├── settings/
│   │   └── hire/
│   ├── shared/                  # Reusable components & utilities
│   │   ├── components/
│   │   └── pipes/
│   ├── layout/                  # Layout components
│   ├── app.component.ts         # Root component
│   └── app.routes.ts            # Application routing
├── assets/                      # Static assets
├── environments/                # Environment configurations
├── styles.css                   # Global styles (Tailwind)
├── main.ts                      # Bootstrap file
└── index.html                   # Entry HTML
```

## Key Features

### 1. **Modular Architecture**
- Separation of concerns with core, features, and shared modules
- Standalone components with Angular 17+
- Lazy-loadable feature modules

### 2. **State Management**
- RxJS signals for reactive state
- BehaviorSubject for data streams
- Observable-based services

### 3. **Services**
- **ExperienceService**: Manage work experience data
- **ProjectService**: Manage project portfolio
- **DocumentationService**: Manage technical documentation
- **SkillsService**: Manage technical skills
- **UserService**: Manage user profile and settings

### 4. **Components**
- **Standalone Components**: All components are standalone
- **ChangeDetectionStrategy.OnPush**: Optimized change detection
- **Reusable UI Components**: Sidebar, Header, Footer

### 5. **Routing**
- Feature-based routing structure
- Default route navigation
- Lazy loading ready

### 6. **Styling**
- Tailwind CSS for utility-first styling
- Custom scrollbar styles
- Responsive design

## Installation

```bash
npm install
```

## Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

## Running Tests

```bash
npm test
```

## Development Best Practices

### 1. **Component Development**
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
  styles: []
})
export class ExampleComponent {
  // Use signals for state
  data = signal<DataType[]>([]);
  
  // Use computed for derived state
  filteredData = computed(() => this.data().filter(...));
}
```

### 2. **Service Development**
```typescript
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private data$ = new BehaviorSubject<DataType[]>([]);
  
  getData(): Observable<DataType[]> {
    return this.data$.asObservable();
  }
}
```

### 3. **Type Safety**
- Strict TypeScript configuration enabled
- Strong typing for all models and services
- Path aliases configured for cleaner imports

## Environment Configuration

### Development (`src/environments/environment.ts`)
- API: `http://localhost:4200/api`
- Log Level: `debug`

### Production (`src/environments/environment.prod.ts`)
- API: `https://kojo-stack.example.com/api`
- Log Level: `error`

## TypeScript Path Aliases

```typescript
@app/*      // src/app/*
@core/*     // src/app/core/*
@features/* // src/app/features/*
@shared/*   // src/app/shared/*
@assets/*   // src/assets/*
@env/*      // src/environments/*
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

1. **OnPush Change Detection**: All components use OnPush strategy
2. **Standalone Components**: Reduced bundle size
3. **Lazy Loading Ready**: Feature modules can be lazy loaded
4. **Tree Shaking**: Unused code automatically removed in production
5. **Signals API**: Efficient reactivity without RxJS overhead

## Deployment

### Angular CLI Build
```bash
ng build --configuration production
```

### Docker Deployment

The application includes production-ready Docker configuration with multi-stage build optimization.

**Quick Start:**
```bash
# Using Docker Compose (recommended)
docker-compose up --build

# Using Docker CLI
docker build -t kojo-stack:latest .
docker run -p 8080:80 kojo-stack:latest
```

**Access the application:**
- Local: http://localhost:8080
- Health check: http://localhost:8080/health

**Files:**
- `Dockerfile`: Multi-stage build configuration (Node 20 Alpine → Nginx Alpine)
- `nginx.conf`: Production-grade Nginx configuration with security headers
- `docker-compose.yml`: Docker Compose orchestration
- `.dockerignore`: Build context optimization
- `DOCKER.md`: Comprehensive Docker documentation
- `DOCKER_QUICKSTART.md`: Quick reference guide

**Features:**
- ✅ Multi-stage build (~50-80 MB image)
- ✅ Gzip compression enabled
- ✅ Security headers configured
- ✅ Browser caching optimized
- ✅ Health check endpoint
- ✅ SPA routing configured

For detailed Docker documentation, see [DOCKER.md](DOCKER.md) and [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)

## Contributing

1. Follow the established project structure
2. Use standalone components
3. Implement strict type checking
4. Write descriptive commit messages
5. Test before submitting

## Version

2026.1.0 - Built with Angular 17+

## License

© 2026 John Kojo Ampia-Addison. All rights reserved.
