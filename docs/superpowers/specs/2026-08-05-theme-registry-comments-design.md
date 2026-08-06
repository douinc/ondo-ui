# Theme Registry Comment Preservation Design

## Goal

Keep the site theme, the installable `@ondo-ui/theme` registry item, and the
English/Korean chart documentation on the same color values, while preserving
the human-readable Tailwind color comments in CSS written by `shadcn add`.

## Scope

- Synchronize the changed light `chart-3` value and all changed dark theme
  values from `app/globals.css` into the `theme` item in `registry.json`.
- Preserve an inline comment for every light and dark token currently exported
  by that registry item, including `radius`.
- Correct inaccurate or misspelled comments touched by this work, including
  `netural` to `neutral` and the light `border`/`input` shade labels.
- Synchronize both chart installation examples in the English and Korean docs.
- Regenerate ignored registry artifacts and verify the complete project build.

This change does not add, rename, or remove a registry component and therefore
does not change the component registration lists.

## Registry Representation

The shadcn registry schema represents each CSS variable value as a string and
does not expose a separate comment field. Each `cssVars.light` and
`cssVars.dark` string will therefore contain the declaration value followed by
an inline CSS comment, for example:

```json
"primary": "oklch(62.3% 0.214 259.815) /* blue-500 */"
```

shadcn passes this string to PostCSS as the declaration value. PostCSS writes
it as valid CSS and retains the comment:

```css
--primary: oklch(62.3% 0.214 259.815) /* blue-500 */;
```

This keeps the existing `cssVars` installation path, automatic Tailwind v4
`@theme inline` mappings, and shadcn overwrite behavior. Duplicating the same
variables under the registry `css` object or shipping a replacement global CSS
file is intentionally avoided because either approach creates competing theme
sources in consumer projects.

## Source Synchronization

`app/globals.css` remains the authored site theme. The `theme` entry in
`registry.json` remains the install payload because that is the format consumed
by shadcn. A focused test will compare every registry light/dark token against
the corresponding declaration in `:root` or `.dark`, including its inline
comment. This prevents the two hand-maintained representations from silently
diverging again.

The registry's typography-only `cssVars.theme` entries are outside the comment
requirement because they are Tailwind theme mappings rather than the authored
light/dark color declarations.

The derived radius variables are an exception to that typography-only rule:
they are part of the authored `@theme inline` block and must also retain their
calculation comments. With the authored `--radius` value of `0.625rem` (10px at
the default 16px root size), the values are:

```css
--radius-sm: calc(var(--radius) * 0.6); /* 10 * 0.6 = 6px */
--radius-md: calc(var(--radius) * 0.8); /* 10 * 0.8 = 8px */
--radius-lg: var(--radius); /* 10 * 1 = 10px */
--radius-xl: calc(var(--radius) * 1.4); /* 10 * 1.4 = 14px */
--radius-2xl: calc(var(--radius) * 1.8); /* 10 * 1.8 = 18px */
--radius-3xl: calc(var(--radius) * 2.2); /* 10 * 2.2 = 22px */
--radius-4xl: calc(var(--radius) * 2.6); /* 10 * 2.6 = 26px */
```

The same seven declarations will be explicit entries in `cssVars.theme`. This
prevents shadcn's default radius expansion from replacing them with
comment-free declarations when a consumer installs the theme.

## Documentation

The full installation palette in `content/docs/components/chart.mdx` and its
Korean counterpart will use the new light `chart-3` and the five new dark chart
values. Their smaller theming examples will also use the new dark `chart-1` and
`chart-2` values. English and Korean examples will remain structurally
identical.

## Verification

Testing will be performed in this order:

1. Add a failing Bun test that checks registry/global value-and-comment parity.
2. Update `app/globals.css`, `registry.json`, and both chart documents until the
   parity test passes.
3. Run `bun run registry:build` and verify `public/r/theme.json` contains the
   comment-bearing values.
4. Exercise shadcn's CSS-variable serialization with a comment-bearing value
   and assert that the resulting declaration contains the inline comment.
5. Run the focused test suite, type checking, linting, and `bun run build`.

Visual spot checks should prioritize dark primary controls, focus rings,
charts, sidebar states, and the Bubble component's primary-derived relative
color. No component-specific restyling is planned unless verification exposes
a concrete regression.
