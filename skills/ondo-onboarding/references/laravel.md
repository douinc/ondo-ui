# Laravel (Inertia + React)

## Init

Laravel is the one framework where the app must exist before `init`:

1. Verify `php` and the `laravel` installer exist (`laravel --version`).
   Fall back to `composer create-project laravel/laravel <name>` only when
   the installer is missing — the installer is what offers the starter kits.
2. Scaffold with the React starter kit, non-interactively:

   ```bash
   laravel new <project> --react --no-interaction
   ```

   The React (Inertia) kit is required — Ondo components are React components
   served through Inertia pages.
3. From inside the new app: `<ondo> init -t laravel`. The Ondo CLI strips the
   template flag and runs a plain shadcn init in place (with the workspace
   root check disabled), installs `theme` and `theme-provider`, and
   configures the `@ondo-ui` registry.

For a pre-existing Laravel app, the React starter kit already ships Tailwind
v4 and the `@/*` alias, so `init` preflight normally passes as-is; an app
without the React kit needs Inertia + React and those prerequisites first.

If `php` or the installer is unavailable, stop this step, report exactly what
is missing, and continue with the steps that do not need the app.

## Design Inspector mount

Create `resources/js/components/design-inspector-mount.tsx`:

```tsx
import "@dou.so/design-inspector/styles.css"

import { DesignInspector } from "@dou.so/design-inspector"

export function DesignInspectorMount() {
  return <DesignInspector />
}
```

Mount it in `resources/js/app.tsx`, alongside the Inertia `<App />` render:

```tsx
setup({ el, App, props }) {
  const root = createRoot(el)
  root.render(
    <>
      <App {...props} />
      {import.meta.env.DEV ? <DesignInspectorMount /> : null}
    </>
  )
},
```

Vite powers Laravel's frontend build, so `import.meta.env.DEV` strips the
inspector from production bundles.

## Verify & dev

- Typecheck: the project's `types` script if present, else
  `<runner> tsc --noEmit`.
- Dev server: `composer run dev` (starts PHP and Vite together) →
  http://localhost:8000, press **Shift** twice to open the Design Inspector.
