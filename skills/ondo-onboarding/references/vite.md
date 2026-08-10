# Vite (React)

## Init

- New project: `<ondo> init -t vite --name <project>` from the parent
  directory. Installs `theme` and `theme-provider` and configures the
  `@ondo-ui` registry.
- Existing project: complete the prerequisites below, then `<ondo> init -t vite`
  at the project root.

## Existing project prerequisites

shadcn's preflight checks these on an existing app and cannot create them —
`init` fails with Tailwind/alias validation errors until they exist:

1. Tailwind v4 through the Vite plugin (not the v3 PostCSS setup):

   ```bash
   <pm> add tailwindcss @tailwindcss/vite
   ```

   Register the plugin in `vite.config.ts` (`plugins: [react(), tailwindcss()]`)
   and put `@import "tailwindcss";` at the top of `src/index.css`.

2. The `@/*` import alias in **both** TypeScript and Vite:
   - `tsconfig.json` and `tsconfig.app.json`:
     `"baseUrl": ".", "paths": { "@/*": ["./src/*"] }`
   - `vite.config.ts`: `resolve: { alias: { "@": path.resolve(__dirname, "./src") } }`

Then run `<ondo> init -t vite` — the preflight passes, the theme installs,
and the `@ondo-ui` registry mapping is injected automatically.

## Design Inspector mount

Create `src/components/design-inspector-mount.tsx`:

```tsx
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

(`theme-provider` is next-themes based and works in Vite; if the project does
not use it, drop the `useTheme` wiring and render `<DesignInspector />` bare.)

Render it once near the root, e.g. in `src/App.tsx`:

```tsx
{import.meta.env.DEV ? <DesignInspectorMount /> : null}
```

`import.meta.env.DEV` is statically replaced, so the inspector is dropped from
production bundles entirely.

## Verify & dev

- Typecheck: `<runner> tsc --noEmit` (or the project's `typecheck` script).
- Dev server: `<pm> run dev` → http://localhost:5173, press **Shift** twice
  to open the Design Inspector.
