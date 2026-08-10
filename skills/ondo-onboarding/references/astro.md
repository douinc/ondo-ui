# Astro

## Init

- New project: `<ondo> init -t astro --name <project>` from the parent
  directory. Installs `theme` only and configures the `@ondo-ui` registry.
- Existing project: `<ondo> init -t astro` at the project root. An existing
  Astro app must first have `@astrojs/react`, Tailwind v4 via
  `@tailwindcss/vite` registered under `vite.plugins` in `astro.config.mjs`,
  a global stylesheet with `@import "tailwindcss";`, and the `@/*` alias in
  `tsconfig.json` — `init` validates these and cannot create them.

Astro gets no `theme-provider`: islands do not share one React root, so a
global provider has nowhere to live. Theme switching, if wanted, belongs to
the host page (e.g. a class on `<html>`).

## Design Inspector mount

The inspector runs as a React island. The shadcn Astro template ships
`@astrojs/react`; confirm the integration exists in `astro.config.mjs` before
mounting.

Create `src/components/design-inspector-mount.tsx`:

```tsx
import "@dou.so/design-inspector/styles.css"

import { DesignInspector } from "@dou.so/design-inspector"

export function DesignInspectorMount() {
  return <DesignInspector />
}
```

Include it in the site-wide layout (`src/layouts/Layout.astro`), before
`</body>`:

```astro
---
import { DesignInspectorMount } from "../components/design-inspector-mount"
---

{import.meta.env.DEV && <DesignInspectorMount client:only="react" />}
```

`client:only="react"` skips server rendering — the inspector reads `window`
and `localStorage` — and the DEV guard keeps it out of production builds.

## Verify & dev

- Typecheck: `<runner> astro check` if `@astrojs/check` is available, else
  `<runner> tsc --noEmit`.
- Dev server: `<pm> run dev` → http://localhost:4321, press **Shift** twice
  to open the Design Inspector.
