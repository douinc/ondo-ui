# React Router (framework mode)

## Init

- New project: `<ondo> init -t react-router --name <project>` from the parent
  directory. Installs `theme` and `theme-provider` and configures the
  `@ondo-ui` registry.
- Existing project: `<ondo> init -t react-router` at the project root. React
  Router framework mode builds on Vite, so an existing app needs the same
  prerequisites as Vite before `init` passes preflight: Tailwind v4 via
  `@tailwindcss/vite` registered in `vite.config.ts`, `@import "tailwindcss";`
  in `app/app.css`, and the `@/*` alias in both tsconfig and Vite
  `resolve.alias` (the official template ships all of these).

## Design Inspector mount

Create `app/components/design-inspector-mount.tsx`. Connecting the host
router lets the inspector's Pages sidebar drive real navigation:

```tsx
import "@dou.so/design-inspector/styles.css"

import { DesignInspector } from "@dou.so/design-inspector"
import { useNavigate } from "react-router"

export function DesignInspectorMount() {
  const navigate = useNavigate()

  return <DesignInspector onNavigate={(href) => navigate(href)} />
}
```

Mount it once in `app/root.tsx`, inside the `Layout`'s `<body>` after
`{children}`:

```tsx
{import.meta.env.DEV ? <DesignInspectorMount /> : null}
```

React Router server-renders the root by default; the DEV guard keeps the
inspector out of production, and the mount must live under the router
provider for `useNavigate` to resolve.

## Verify & dev

- Typecheck: the project's `typecheck` script (the template ships one:
  `react-router typegen && tsc`), else `<runner> tsc --noEmit`.
- Dev server: `<pm> run dev` → http://localhost:5173, press **Shift** twice
  to open the Design Inspector.
