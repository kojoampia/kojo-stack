# Management Section - Administration Dashboard

## Overview
A comprehensive administration management section with dashboard and CRUD components for all system models.

## Directory Structure

```
src/app/management/
├── admin-dashboard/
│   ├── admin-dashboard.component.ts
│   ├── admin-dashboard.component.html
│   └── admin-dashboard.component.scss
├── profile-dashboard/
│   ├── profile-dashboard.component.ts
│   ├── profile-dashboard.component.html
│   └── profile-dashboard.component.scss
├── setting-dashboard/
│   ├── setting-dashboard.component.ts
│   ├── setting-dashboard.component.html
│   └── setting-dashboard.component.scss
├── documentation-dashboard/
│   ├── documentation-dashboard.component.ts
│   ├── documentation-dashboard.component.html
│   └── documentation-dashboard.component.scss
├── experience-dashboard/
│   ├── experience-dashboard.component.ts
│   ├── experience-dashboard.component.html
│   └── experience-dashboard.component.scss
├── skill-dashboard/
│   ├── skill-dashboard.component.ts
│   ├── skill-dashboard.component.html
│   └── skill-dashboard.component.scss
├── project-dashboard/
│   ├── project-dashboard.component.ts
│   ├── project-dashboard.component.html
│   └── project-dashboard.component.scss
├── inquiry-dashboard/
│   ├── inquiry-dashboard.component.ts
│   ├── inquiry-dashboard.component.html
│   └── inquiry-dashboard.component.scss
├── metric-dashboard/
│   ├── metric-dashboard.component.ts
│   ├── metric-dashboard.component.html
│   └── metric-dashboard.component.scss
├── model-dashboard-base.component.ts (base class)
└── management.routes.ts (routing configuration)
```

## Components

### 1. Admin Dashboard (`admin-dashboard`)
- **Purpose**: Main management portal with navigation to all model dashboards
- **Features**:
  - Grid-based navigation menu
  - One dashboard tile per model (12 in total)
  - Color-coded cards with icons
  - Responsive design (mobile-friendly)
  - Hover effects and animations

### 2. Profile Dashboard (`profile-dashboard`)
- **Model**: Profile (user profiles)
- **Features**:
  - ✅ List all profiles (table view)
  - ✅ Create new profile (form)
  - ✅ Edit existing profile (form with pre-fill)
  - ✅ Delete profile (confirmation dialog)
  - ✅ Error handling and loading states
  - ✅ Responsive table design

### 3. Settings Dashboard (`setting-dashboard`)
- **Model**: Setting (application settings)
- **Features**:
  - ✅ List all settings
  - ✅ Create new setting
  - ✅ Edit setting (checkboxes, dropdowns)
  - ✅ Delete setting with confirmation
  - ✅ Form with theme selector

### 4. Documentation Dashboard (`documentation-dashboard`)
- **Model**: Documentation
- **Status**: Implemented (list / create / update / delete with its own template)

### 5. Experience Dashboard (`experience-dashboard`)
- **Model**: Experience (work experience)
- **Status**: Implemented (list / create / update / delete with its own template)

### 6. Skill Dashboard (`skill-dashboard`)
- **Model**: TechSkill (technical skills)
- **Status**: Implemented (list / create / update / delete with its own template)

### 7. Project Dashboard (`project-dashboard`)
- **Model**: Project
- **Status**: Implemented (list / create / update / delete with its own template)

### 8. Inquiry Dashboard (`inquiry-dashboard`)
- **Model**: Inquiry
- **Status**: Implemented (list / create / update / delete with its own template)

### 9. Metric Dashboard (`metric-dashboard`)
- **Model**: Metric (system metrics)
- **Status**: Implemented (list / create / update / delete with its own template)

## Routing Configuration

All dashboards are accessible via the management routes:

```
/management                 → Admin Dashboard (main menu)
/management/profiles        → Profile Dashboard
/management/settings        → Settings Dashboard
/management/documentation   → Documentation Dashboard
/management/experience      → Experience Dashboard
/management/skills          → Skill Dashboard
/management/projects        → Project Dashboard
/management/inquiries       → Inquiry Dashboard
/management/metrics         → Metric Dashboard
```

## Features

### Common Dashboard Features (Profile & Settings)
- **List View**: Table with sortable columns and actions
- **Create View**: Form with required/optional fields
- **Edit View**: Pre-populated form for updating records
- **Delete View**: Confirmation dialog before deletion
- **Error Handling**: User-friendly error messages
- **Loading States**: Spinner indicator during operations
- **Empty State**: Message when no items exist

### UI Components
- Responsive table design
- Modal-style forms
- Delete confirmation dialogs
- Loading indicators
- Error alert messages
- Action buttons (Edit, Delete, Save, Cancel)

## Styling

### Shared Styles
File: `src/app/shared/styles/dashboard.scss`
- Common dashboard layout patterns
- Button styles (primary, secondary, danger, info)
- Table styling
- Form styling
- Modal dialogs
- Responsive breakpoints

### Component-Specific Styles
- Profile Dashboard: Table with hover effects
- Settings Dashboard: Badges for boolean values, styled select dropdowns
- Admin Dashboard: Card-based grid layout with gradient backgrounds

## Services Integration

The dashboards integrate with existing services:
- `ProfileService` (profile-dashboard)
- `SettingsService` (setting-dashboard)

Services are injected via Angular's DI and used for:
- `getAll()` - Fetch all items
- `getById(id)` - Get single item
- `create(item)` - Create new item
- `update(id, item)` - Update existing item
- `delete(id)` - Delete item

## Implementation Status

| Component | List | Create | Update | Delete | Status |
|-----------|------|--------|--------|--------|--------|
| Admin Dashboard | ✅ | - | - | - | Complete |
| Profile Dashboard | ✅ | ✅ | ✅ | ✅ | Complete |
| Settings Dashboard | ✅ | ✅ | ✅ | ✅ | Complete |
| Account Dashboard | ✅ | ✅ | ✅ | ✅ | Complete |
| Education Dashboard | ✅ | ✅ | ✅ | ✅ | Complete |
| KPI Dashboard | ✅ | ✅ | ✅ | ✅ | Complete |
| Documentation | ✅ | ✅ | ✅ | ✅ | Complete |
| Experience | ✅ | ✅ | ✅ | ✅ | Complete |
| Skills | ✅ | ✅ | ✅ | ✅ | Complete |
| Projects | ✅ | ✅ | ✅ | ✅ | Complete |
| Inquiries | ✅ | ✅ | ✅ | ✅ | Complete |
| Metrics | ✅ | ✅ | ✅ | ✅ | Complete |

## How to Use

### Navigate to Management
1. Access `/management` to view the Admin Dashboard
2. Click on any model tile to open its dashboard
3. Use the "Add New" button to create items
4. Click "Edit" to modify existing items
5. Click "Delete" to remove items (with confirmation)

### Adding a New Model Dashboard

Follow the pattern the existing twelve dashboards use:

1. **Import Services**: Import the appropriate service (e.g., DocumentationService)
2. **Define Form Fields**: Update formData with model-specific fields
3. **Implement CRUD**: Hook up service methods to component methods
4. **Update Template**: Customize the table columns and form fields
5. **Style**: Add component-specific styles as needed
6. **Register the route** in `management.routes.ts`

```typescript
// Inject
private readonly docService = inject(DocumentationService);

// Implement CRUD in loadItems(), saveItem(), confirmDelete()
```

> `ModelDashboardBase` is still untyped (`any[]`/`any`). Converting it to an
> abstract generic class is tracked as G12 in `plan.md`.

## Responsive Design

All dashboards are fully responsive:
- **Desktop**: Multi-column grid layout, full-featured tables
- **Tablet**: Adjusted grid, stacked layouts
- **Mobile**: Single-column layout, simplified forms, touch-friendly buttons

## Browser Compatibility

Built with Angular 19 standalone components:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Build Status

Verify with `npm run build:prod`, `npm run test:ci` and `npm run lint`.

Note: the production build currently exceeds its 1 MB initial-bundle budget
(~1.12 MB) because every management dashboard is eagerly imported. See G11 in
`plan.md`.

## Files Created

- 14 TypeScript component files
- 3 HTML template files
- 4 SCSS stylesheet files
- 1 routing configuration file
- 1 shared dashboard stylesheet
- 1 base component class
