# @dou.so/design-inspector

A development-only, same-origin design inspector for React applications built
with [Ondo UI](https://ui.ondo.dou.so). It audits the components mounted on a
page across mobile, tablet, FHD, and QHD viewports, with component layers,
comparison mode, keyboard shortcuts, page navigation, and `DesktopWindow`
screenshots.

## Installation

```bash
bun add -D @dou.so/design-inspector
```

## Usage

```tsx
"use client"

import "@dou.so/design-inspector/styles.css"

import { DesignInspector } from "@dou.so/design-inspector"

export function DesignInspectorMount() {
  return <DesignInspector />
}
```

Render the mount once near the root of the application, guarded so it never
ships to production:

```tsx
{process.env.NODE_ENV !== "production" ? <DesignInspectorMount /> : null}
```

The bundled stylesheet is precompiled and scoped to the inspector's own
elements, so it works in applications that do not use Tailwind CSS or the Ondo
theme. Theming is delegated to the host through `onThemeChange` and
`applyPreviewTheme`.

Full documentation: <https://ui.ondo.dou.so/docs/design-inspector>
