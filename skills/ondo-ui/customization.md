# Ondo Customization and Theming

Read the actual project first:

```bash
bunx --bun @dou.so/ondo-ui@latest info --json
```

Edit the reported `tailwindCssFile`; do not create a second global stylesheet. Ondo ships Tailwind CSS v4 mappings through `@theme inline`, CSS variables in `:root`, and class-based dark values in `.dark` via `@custom-variant dark`.

## Semantic tokens

Prefer semantic utilities backed by the theme variables:

| Tokens | Use |
| --- | --- |
| `background` / `foreground` | Page canvas and default text. |
| `card`, `popover` and their foregrounds | Elevated and floating surfaces. |
| `primary`, `secondary`, `muted`, `accent` and their foregrounds | Actions, hierarchy, and interactive states. |
| `destructive` | Errors and destructive actions. |
| `border`, `input`, `ring` | Dividers, controls, and focus rings. |
| `chart-1`…`chart-5` | Data visualization. |
| `sidebar-*` | Sidebar surfaces, actions, borders, and rings. |
| `info`, `success`, `warning` | Product status states. |
| `surface` / `surface-foreground` | Secondary neutral surfaces. |
| `code`, `code-foreground`, `code-highlight`, `code-number` | Code blocks and line emphasis. |
| `selection` / `selection-foreground` | Selected text. |

Use classes such as `bg-background`, `text-foreground`, `bg-surface`, `text-muted-foreground`, `text-info`, `text-success`, `text-warning`, and `text-destructive`. Prefer these over raw palette colors or manual light/dark pairs when a semantic state exists.

## Typography

- Pretendard is `font-sans` and `font-heading`, including Korean glyph coverage.
- Monaspace Neon is `font-mono` for code, preformatted text, keyboard input, and samples.

Use the theme utilities rather than declaring font families inside components.

## Tailwind v4 additions

Define light and dark CSS variables in the reported global CSS file, then expose them through `@theme inline`:

```css
@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}

:root {
  --brand: oklch(0.62 0.18 250);
  --brand-foreground: oklch(1 0 0);
}

.dark {
  --brand: oklch(0.72 0.16 250);
  --brand-foreground: oklch(0.15 0.03 250);
}
```

Confirm `tailwindVersion` before changing theme registration. Preserve the project's existing setup when it is not v4.

## Component customization order

1. Select an existing component variant or size.
2. Pass layout or local visual changes through `className`.
3. Add a reusable `cva` variant to the owned component source.
4. Build a wrapper or Composition when several primitives form one repeated product pattern.

Use `cn()` for conditional classes. Prefer `gap-*` for spacing between children and `size-*` when width and height are equal.
