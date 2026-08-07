---
name: add-component
description: Add a new component (or composition) to the ondo-ui registry, covering the component file, demos, EN/KO docs, registry entry, the /components gallery listing, and the changelog + version bump. Use this whenever work touches adding, registering, renaming, or removing an ondo-ui registry item -- and also when something already built is mysteriously missing from the docs sidebar, the /components page, or a shadcn install, since that is almost always a missed registration step rather than a bug in the component.
metadata:
  internal: true
---

# Adding a component to ondo-ui

## Why this skill exists

Creating `components/ui/<name>.tsx` does not add a component to ondo-ui. The
component only becomes real once it is listed in several hand-maintained files,
and **every one of those lists fails silently**: nothing errors, nothing warns,
the build passes, and the component simply never appears where you expected it.

The most recent example: a component shipped with docs, demos, and a registry
entry, but was left out of `lib/components-list.ts`. Everything built fine and
the docs page worked. It just never showed up on `/components`, and that was
only noticed by browsing the site by hand.

So the ordering principle here is: **do the registration first and verify it
mechanically, because the parts that break are the boring ones.**

## Registration points

These are the places a component has to appear. The "if you skip it" column is
what makes each one worth checking rather than trusting.

| # | Location | If you skip it |
|---|---|---|
| 1 | `components/ui/<name>.tsx` | Nothing exists |
| 2 | `components/demos/<name>-*.tsx` | Docs previews render blank |
| 3 | `components/demos/index.tsx` (import + map entry) | `<ComponentPreview>` renders nothing, no error |
| 4 | `content/docs/components/<name>.mdx` **and** `.ko.mdx` | No docs page in that locale |
| 5 | `content/docs/components/meta.json` (`pages` array) | Page exists but is absent from the sidebar |
| 6 | `registry.json` (`items`) | `shadcn add` cannot install it |
| 7 | `lib/components-list.ts` | Missing from the `/components` gallery |
| 8 | `packages/design-inspector/src/catalog.ts` (`ONDO_COMPONENT_NAMES` / `ONDO_COMPOSITION_NAMES`) | Design Inspector cannot identify it; `bun test` fails on the registry-vs-catalog cross-check in `catalog.test.ts` |

Point 8 is the one list that does fail loudly -- a test asserts it matches
`registry.json` -- but only if the tests are actually run, so it still belongs
in the checklist.

A release additionally needs a changelog entry and a version bump -- see
"Releasing" below.

## Workflow

Work in this order. Steps 1-3 are the creative part; steps 4-7 are mechanical
and are exactly where things get dropped, so finish them before moving on.

1. **Write the component** following the conventions below.
2. **Write demos** as `components/demos/<name>-<variant>.tsx`, one default export
   each. Name them after what they demonstrate (`heading-wrap`, not `heading-2`).
3. **Register the demos** in `components/demos/index.tsx` -- add the import and
   the `"<demo-name>": Component,` entry, both kept alphabetical.
4. **Write both docs pages** (`<name>.mdx` and `<name>.ko.mdx`). Mirror the
   structure of a recent, similar component rather than inventing a layout.
5. **Add to `meta.json`, `registry.json`, `lib/components-list.ts`, and the
   Design Inspector catalog** (`packages/design-inspector/src/catalog.ts`) --
   alphabetically in each.
6. **Verify** (see below). Do not skip this even when you are sure.
7. **Release** if the change is shipping: changelog entry + version bump.

## Verifying

Run the bundled checker. It compares the registration points against each other
and names the consequence of anything missing:

```bash
python3 .claude/skills/add-component/scripts/check-registration.py <name>
python3 .claude/skills/add-component/scripts/check-registration.py   # every component
```

Then run the tests, which enforce the Design Inspector catalog against
`registry.json`, and the build, which is the only thing that proves the MDX
compiles and the registry builds:

```bash
bun test
bun run build
```

The checker is deliberately narrow -- it only asserts things that are always
true in this repo. It does **not** compare a docs code block against its demo
file byte-for-byte, because that is not the convention here (see "Docs" below).

## Conventions

### Component

Read a neighbouring component in `components/ui/` before writing a new one; the
house style is consistent and easier to copy than to describe. The load-bearing
points:

- **Base UI, not Radix.** Every component here builds on `@base-ui/react`. There
  is no `@radix-ui` dependency and no `asChild` anywhere in the codebase.
- **Polymorphism uses the `render` prop**, which is Base UI's replacement for
  Radix's `asChild`/`Slot`. Accept it via `useRender.ComponentProps<"tag">` and
  pass it through `useRender`. Do not reintroduce `asChild`.
- **Variants use `cva`**, merged with `cn` from `@/lib/utils`.
- `cn` is `twMerge(clsx(...))`, so a caller's `className` reliably beats a
  variant class. Lean on that instead of adding props: responsive behaviour
  belongs in `className` (`md:text-balance`), not in a breakpoint-shaped prop.
  Tailwind cannot see dynamically built class strings, so a responsive prop
  would need a full static lookup table -- rarely worth it.

### Styling and theme tokens

Prefer composing from Tailwind utilities over introducing a new theme variable.
A registry component is copied into someone else's project; if it depends on a
token they do not have, Tailwind generates no class at all and the component
silently renders unstyled. Utilities keep it self-contained.

If a value genuinely has no standard utility, an arbitrary value is fine --
prefer `rem`/`em` over `px`, and prefer a unitless `line-height` ratio
(`text-[2rem]/[1.25]`) over a fixed length, so nested text with a different
font-size recomputes its leading instead of inheriting a fixed one.

If a token really is needed, it belongs in the `theme` item's `cssVars.theme` in
`registry.json`, the same path `font-heading` uses.

### Demos

One default-exported component per file, no props. Keep them small and focused
on the single thing the surrounding docs section is explaining.

### Docs (EN + KO)

Both locales are required. Follow the section order used by existing pages:
frontmatter → lead `<ComponentPreview>` → optional `<Callout>` → Installation →
Usage → Examples → API reference.

Two things that look like bugs but are intentional:

- **Korean pages translate the user-visible copy inside the demo code blocks.**
  The fenced code is illustrative, not a source of truth.
- **English pages sometimes abridge a long demo** (fewer list items, say) to
  keep the page readable.

So the fenced code beside a `<ComponentPreview>` is not required to match the
demo file exactly. What must hold is that it shows the *same component* -- the
checker enforces that via the default export name.

Internal MDX links are plain paths (`/docs/components/button`); the site
localises them at render time, so do not add a locale prefix.

### Registry

A `registry:ui` item lists **only** `components/ui/<name>.tsx` in `files`.
Demos are not registry items. Set `dependencies` to the npm packages the file
imports (typically `@base-ui/react`, `class-variance-authority`) and
`registryDependencies` to `["utils"]` plus any ondo-ui component it composes.

### Releasing

Versioning here is not semver -- each digit maps to a kind of registry change.
`content/docs/versioning.mdx` is the source of truth; the short version:

- **MINOR** -- a new item is added to the registry (a new component is this case)
- **PATCH** -- an existing item's code changes (a prop added, a fix, a restyle)
- **MAJOR** -- a major upstream shadcn/ui change is adopted

One changelog entry equals exactly one bump, and only the highest-ranked digit
bumps. Then:

1. Add `content/docs/changelog/<YYYY-MM-DD>-<slug>.mdx` **and** `.ko.mdx`. The
   date comes from the filename. Put the version in the frontmatter
   (`version: 0.3.0`) **and** on its own line at the top of the body
   (`**v0.3.0**`) -- the frontmatter field is what orders the page, since two
   releases can share a date and the filename cannot break that tie; the body
   line is what readers see. Then prose plus bullets.
   Dated entries are intentionally absent from `changelog/meta.json` -- the
   aggregation route picks them up regardless, and listing them would duplicate
   them in the sidebar.
2. Bump `version` in `package.json` to match.

### Commits

Commit messages are written in **English** regardless of the language of the
surrounding conversation, and follow the repo's existing style: a
`type(scope): Subject` line, with the version in the subject for releases
(`feat: Add Heading component (v0.3.0)`).

Note that `main` is protected and expects changes to arrive via pull request.
Pushing straight to `main` succeeds for maintainers with bypass rights but
records a rule violation, so branch unless the user asks otherwise.

## Removing or renaming a component

The same eight places apply in reverse. Run the checker afterwards with no
arguments -- it flags entries in `meta.json` or `lib/components-list.ts` that
point at docs pages which no longer exist, which is the usual leftover.
