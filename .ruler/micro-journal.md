# Micro Journal

Vue 3 + TypeScript + Vuetify micro-journal app using Vite and pnpm.

## Tech Stack

- **Frontend**: Vue 3 (Composition API with `<script setup>`), TypeScript, Vuetify 4
- **Styling**: Tailwind CSS 4, SCSS (Vuetify theme settings)
- **Build**: Vite with file-based routing via `vue-router/vite`
- **Testing**: Vitest + @vue/test-utils

## Project Structure

- `src/main.ts` — application entry point
- `src/App.vue` — root component
- `src/components/` — reusable Vue components (multi-word PascalCase names)
- `src/pages/` — auto-converted to routes (e.g., `src/pages/index.vue` → `/`)
- `src/plugins/` — global plugin registration (Vuetify, etc.)
- `src/router/` — router setup using `vue-router/auto-routes`
- `src/styles/` — global styles, Tailwind layers, and Vuetify theme settings

## Key Patterns

### File-Based Routing

Pages in `src/pages/` become routes automatically via `VueRouter` in `vite.config.mts`:

```typescript
import VueRouter from 'vue-router/vite';
// ...
plugins: [VueRouter({ dts: 'src/typed-router.d.ts' }) /* ... */];
```

- Folder structure maps to URL paths (similar to Next.js file routing)
- Dynamic segments use bracket notation (e.g., `[id]/index.vue` → `/:id`)
- Router is configured in `src/router/index.ts` with `createWebHistory`

### Components

- Use multi-word PascalCase component names (e.g., `HelloWorld.vue`)
- Import components explicitly — there is no auto-import plugin
- Pages and layouts may use single-word names (ESLint exception in `eslint.config.js`)

### Styling

- Tailwind utility classes in templates; `@apply` in scoped `<style>` blocks when needed
- Vuetify theme config: `src/styles/settings.scss`
- Global styles: `src/styles/main.scss`, `src/styles/tailwind.css`, `src/styles/layers.css`

### Vuetify MCP

This project configures the Vuetify MCP server in `.ruler/ruler.toml`. Use it for Vuetify component API questions and patterns.

## Code Conventions

- **Components**: Multi-word PascalCase; pages may use lowercase for URL-friendly paths
- **Composables**: Prefix with `use`, colocate or place in a future `src/composables/` directory
- **Tests**: Co-located in `__tests__/`, named `*.spec.ts`
- **Comments**: Explain "why", not "what"
- **Package manager**: Always use `pnpm`, never npm or yarn
- **Functions**: Prefer arrow functions (`const fn = () => {}`) for callbacks, helpers, and composables. Use a standard `function` declaration only when required (e.g., generators, hoisting) or clearly advantageous (e.g., a named top-level export where a function name improves stack traces or recursion)

## Commands

```bash
pnpm dev              # Dev server (localhost:3000)
pnpm test             # Run tests once
pnpm test:dev         # Watch mode
pnpm test:cov         # Coverage
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm build            # Production build (type-check + vite build)
pnpm type-check       # vue-tsc only
pnpm mcp              # Apply Ruler rules to all configured agents
pnpm mcp:revert       # Revert Ruler-generated agent config files
```

Single test file: `pnpm vitest run src/path/to/file.spec.ts`

## Pre-Commit

Husky runs `lint-staged` on commit — Prettier then ESLint on staged `*.{js,jsx,ts,tsx,vue,md,json}` files.
