---
description: "Review or implement Tailwind CSS styling in kojo-stack components with focus on theme consistency, responsive design, and dark mode compliance."
name: "Review Tailwind Styling"
argument-hint: "Component file(s), styling concern, responsive breakpoints, and dark theme usage"
agent: "fullstack-engineer"
---
Review or improve Tailwind CSS usage in `kojo-stack` components with project theme compliance.

Scope:
- Component template (HTML) with Tailwind classes
- Component styles (SCSS) for local overrides only
- Tailwind config in `tailwind.config.js` for theme extensions
- Dark mode colors: `bg-slate-950`, `bg-slate-900`, `text-slate-100` as primary

Review checklist:
- Classes correctly achieve intended layout/spacing without hardcoded pixels
- Responsive breakpoints (`md:`, `lg:`) appropriately cascade from mobile defaults
- Colors respect dark theme (`bg-slate-*`, `text-slate-*` palette)
- No custom classes violating Tailwind conventions (e.g., `bg-custom-blue`)
- No unnecessary component `.scss` files for purely utility-driven styling
- Text sizes, font weights, and line heights align with project design system

Fixes to propose:
- Deduplicate repeated utility classes into component styles if justified
- Move dark-theme colors to tailwind.config.js if missing
- Replace hardcoded sizes with Tailwind spacing scale
- Optimize responsive breakpoint cascade
- Suggest cache bust if new Tailwind classes don't appear after rebuild

Return format:
1. Findings with file references and specific Tailwind recommendations
2. Classes changed or added
3. Tailwind config updates (if any)
4. Validation steps (rebuild, inspect output) and cache clearing if needed
