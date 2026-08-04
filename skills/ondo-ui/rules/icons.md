# Icons

Read `config.iconLibrary` from `info --json` and import from that library. Ondo's default configuration uses Tabler icons, but the current project context wins.

## Inline placement

**Incorrect:** guess an icon package and control spacing and size on an icon inside a component.

```tsx
<Button><SearchIcon className="mr-2 size-4" />Search</Button>
```

**Correct:** mark inline placement with `data-icon` and let the component own icon sizing.

```tsx
<Button>
  <IconSearch data-icon="inline-start" />
  Search
</Button>

<Button>
  Continue
  <IconArrowRight data-icon="inline-end" />
</Button>
```

Do not add `size-*`, `w-*`, `h-*`, or margin classes to icons inside `Button`, menu items, `Alert`, Sidebar items, or other components with icon selectors. Add custom sizing only when the user explicitly requests it and the containing component does not own the size.

## Component props

**Incorrect:** pass a string key through a local icon lookup.

```tsx
<Status icon="check" />
```

**Correct:** pass the component object and render it directly.

```tsx
import type { ComponentType } from "react"
import { IconCheck } from "@tabler/icons-react"

function Status({ icon: Icon }: { icon: ComponentType }) {
  return <Icon />
}

<Status icon={IconCheck} />
```

Name icon-only controls with `aria-label` or an `sr-only` label. Use `render` when an icon-bearing trigger composes another Ondo component.
