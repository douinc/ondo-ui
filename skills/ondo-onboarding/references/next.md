# Next.js

## Init

- New project: `<ondo> init -t next --name <project>` from the parent
  directory. Scaffolds the App Router template, installs `theme` and
  `theme-provider` (next-themes), and configures the `@ondo-ui` registry.
- Existing project: `<ondo> init -t next` at the project root. shadcn's
  preflight expects Tailwind v4 (`tailwindcss` + `@tailwindcss/postcss`, with
  `@import "tailwindcss";` in the global CSS) and the `@/*` alias in
  `tsconfig.json` — `create-next-app` defaults include the alias, but a
  Tailwind-less app needs Tailwind wired in first; `init` validates these and
  cannot create them.

## Design Inspector mount

Create `components/design-inspector-mount.tsx` (follow the project's component
alias if it differs). The template ships `theme-provider` on next-themes, so
sync the inspector's theme control with the app:

```tsx
"use client"

import "@dou.so/design-inspector/styles.css"

import { DesignInspector } from "@dou.so/design-inspector"
import { useTheme } from "next-themes"

export function DesignInspectorMount() {
  const { setTheme, theme } = useTheme()

  return (
    <DesignInspector
      defaultTheme={theme === "dark" || theme === "light" ? theme : "system"}
      onThemeChange={(nextTheme) => setTheme(nextTheme)}
    />
  )
}
```

Mount it once in `app/layout.tsx`, inside `<body>` after `{children}` (and
inside `ThemeProvider` if the layout wraps children with one):

```tsx
{process.env.NODE_ENV !== "production" ? <DesignInspectorMount /> : null}
```

The guard keeps the inspector — and its download — out of production builds.
For a Pages Router project, mount in `pages/_app.tsx` with the same guard.

## Verify & dev

- Typecheck: the project's `typecheck` script if present, else
  `<runner> tsc --noEmit` (with `<runner>` = `bunx --bun`, `pnpm dlx`, `npx`,
  or `yarn dlx`).
- Dev server: `<pm> run dev` → http://localhost:3000, press **Shift** twice
  to open the Design Inspector.
