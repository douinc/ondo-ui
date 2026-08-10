# TanStack Start

Template name is `start`.

## Init

- New project: `<ondo> init -t start --name <project>` from the parent
  directory. Installs `theme` and `theme-provider` and configures the
  `@ondo-ui` registry.
- Existing project: `<ondo> init -t start` at the project root. TanStack
  Start builds on Vite, so an existing app needs the same prerequisites as
  Vite before `init` passes preflight: Tailwind v4 via `@tailwindcss/vite`
  registered in `vite.config.ts`, `@import "tailwindcss";` in the global CSS,
  and the `@/*` alias in both tsconfig and Vite `resolve.alias`.

## Design Inspector mount

Create `src/components/design-inspector-mount.tsx`:

```tsx
import "@dou.so/design-inspector/styles.css"

import { DesignInspector } from "@dou.so/design-inspector"

export function DesignInspectorMount() {
  return <DesignInspector />
}
```

Mount it in the root route's component (`src/routes/__root.tsx`), inside the
document body after the outlet:

```tsx
{import.meta.env.DEV ? <DesignInspectorMount /> : null}
```

TanStack Start server-renders the root route; if hydration warnings appear,
wrap the mount in the router's `ClientOnly` helper so it renders only in the
browser.

## Verify & dev

- Typecheck: `<runner> tsc --noEmit` (or the project's `typecheck` script).
- Dev server: `<pm> run dev` → http://localhost:3000, press **Shift** twice
  to open the Design Inspector.
