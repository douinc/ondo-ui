# Styling

Preserve Ondo's semantic Tailwind system and component-owned behavior.

## Semantic classes

**Incorrect:** hard-code palette colors and a second dark-mode palette.

```tsx
<p className="bg-blue-50 text-green-600 dark:bg-blue-950 dark:text-green-400">
  Active
</p>
```

**Correct:** choose tokens by meaning.

```tsx
<p className="bg-surface text-success">Active</p>
<p className="text-info">Processing</p>
<p className="text-warning">Needs review</p>
<p className="text-destructive">Failed</p>
```

Use `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `surface`, `info`, `success`, `warning`, and `destructive` utilities. Add `dark:` only for a visual behavior that semantic variables cannot express.

## Layout and class merging

**Incorrect:** use sibling spacing, duplicate dimensions, long truncation utilities, or interpolated class strings.

```tsx
<div className={`space-y-4 ${active ? "bg-primary" : "bg-muted"}`}>
  <Icon className="h-4 w-4" />
  <span className="overflow-hidden text-ellipsis whitespace-nowrap">Name</span>
</div>
```

**Correct:** use `gap-*`, `size-*`, `truncate`, and `cn()`.

```tsx
import { cn } from "@/lib/utils"

<div className={cn("flex flex-col gap-4", active ? "bg-primary" : "bg-muted")}>
  <Icon className="size-4" />
  <span className="truncate">Name</span>
</div>
```

Use existing variants first, then `className`, then a reusable `cva` variant, then a wrapper or Composition.

## Component-owned layers

**Incorrect:** add manual stacking to an Ondo overlay.

```tsx
<DialogContent className="z-[9999]">...</DialogContent>
```

**Correct:** let `Dialog`, `Sheet`, `Drawer`, `AlertDialog`, menus, popovers, tooltips, and hover cards own their overlay z-index.

```tsx
<DialogContent>...</DialogContent>
```

Use shipped utilities such as `shimmer` and `scroll-fade-*` instead of custom keyframes or mask gradients when they match the behavior.

