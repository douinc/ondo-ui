# Theme Radius Comment Preservation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans (inline execution is selected). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add calculation comments to all derived radius variables in the site theme and preserve those comments in CSS installed from the Ondo registry.

**Architecture:** Keep the existing `@theme inline` radius formulas and add inline comments to them. Add the same seven formulas as explicit `cssVars.theme` entries so shadcn's installer writes the commented declarations instead of generating its built-in comment-free radius scale.

**Tech Stack:** Tailwind CSS v4, shadcn registry schema and CLI 4.16.0, Bun tests, PostCSS, Next static export.

## Global Constraints

- Use the default `--radius` value of `0.625rem`, documented as `10px` at a 16px root size.
- Use comments in the exact form `/* 10 * multiplier = resultpx */`; do not include `Spacing-*` labels.
- Keep all seven formulas unchanged; comments are explanatory only.
- Preserve existing theme and registry values unrelated to radius.
- Verify the real `shadcn add` CSS output, not only the JSON source.
- Work on `fix/theme-radius-comments`; do not modify `main` directly.

---

## File Map

### Modify

- `app/globals.css` — add calculation comments to the seven `@theme inline` radius declarations.
- `registry.json` — add the same seven comment-bearing formulas to `cssVars.theme`.
- `scripts/theme-registry.test.ts` — assert all seven registry values and installed CSS declarations.

### Documentation

- `docs/superpowers/specs/2026-08-05-theme-registry-comments-design.md` — record the approved radius comment contract.

### Generated and ignored

- `public/r/theme.json` and `public/r/registry.json` — regenerate and inspect; do not track manually.

---

### Task 1: Add failing radius comment assertions

**Files:**

- Modify: `scripts/theme-registry.test.ts`

**Interfaces:**

- Consumes: the existing real registry fixture and local shadcn installation helper.
- Produces: a regression contract for all seven derived radius formulas.

- [ ] **Step 1: Add the hand-derived radius fixture and source assertions**

Add this literal fixture near the test suite and assert every entry exists in
`theme.cssVars.theme` with the exact comment-bearing value:

```ts
const RADIUS_THEME_VALUES = {
  "radius-sm": "calc(var(--radius) * 0.6) /* 10 * 0.6 = 6px */",
  "radius-md": "calc(var(--radius) * 0.8) /* 10 * 0.8 = 8px */",
  "radius-lg": "var(--radius) /* 10 * 1 = 10px */",
  "radius-xl": "calc(var(--radius) * 1.4) /* 10 * 1.4 = 14px */",
  "radius-2xl": "calc(var(--radius) * 1.8) /* 10 * 1.8 = 18px */",
  "radius-3xl": "calc(var(--radius) * 2.2) /* 10 * 2.2 = 22px */",
  "radius-4xl": "calc(var(--radius) * 2.6) /* 10 * 2.6 = 26px */",
} as const
```

Use `expect(theme.cssVars?.theme).toMatchObject(RADIUS_THEME_VALUES)` so a
missing or altered registry value fails independently of the installation
assertions.

- [ ] **Step 2: Assert every radius declaration in the real installed CSS**

In the existing `preserves registry comments in CSS installed by shadcn` test,
loop over the same literal entries and assert the installer emits the comment
before the declaration terminator:

```ts
for (const [name, value] of Object.entries(RADIUS_THEME_VALUES)) {
  expect(css).toContain(`--${name}: ${value};`)
}
```

- [ ] **Step 3: Run the focused test and verify the intended RED state**

Run:

```bash
bun test scripts/theme-registry.test.ts
```

Expected: FAIL because `registry.json` has no derived radius entries and the
current installed CSS has comment-free radius declarations.

- [ ] **Step 4: Commit the failing test**

```bash
git add scripts/theme-registry.test.ts
git commit -m "test: Cover derived radius comments"
```

---

### Task 2: Add radius comments to source and registry themes

**Files:**

- Modify: `app/globals.css:75-81`
- Modify: `registry.json:47-53`

- [ ] **Step 1: Add calculation comments to the authored `@theme inline` declarations**

Change only the seven declarations to:

```css
--radius-sm: calc(var(--radius) * 0.6); /* 10 * 0.6 = 6px */
--radius-md: calc(var(--radius) * 0.8); /* 10 * 0.8 = 8px */
--radius-lg: var(--radius); /* 10 * 1 = 10px */
--radius-xl: calc(var(--radius) * 1.4); /* 10 * 1.4 = 14px */
--radius-2xl: calc(var(--radius) * 1.8); /* 10 * 1.8 = 18px */
--radius-3xl: calc(var(--radius) * 2.2); /* 10 * 2.2 = 22px */
--radius-4xl: calc(var(--radius) * 2.6); /* 10 * 2.6 = 26px */
```

- [ ] **Step 2: Add the same seven entries to `cssVars.theme`**

Insert the seven JSON strings after `font-heading` in `registry.json`, using
the exact values from `RADIUS_THEME_VALUES`. Keep the JSON valid and preserve
the existing font entries.

- [ ] **Step 3: Run the focused test and verify GREEN**

```bash
bun test scripts/theme-registry.test.ts
```

Expected: all theme registry tests pass, including all seven installed CSS
comment assertions.

- [ ] **Step 4: Commit the implementation**

```bash
git add app/globals.css registry.json
git commit -m "fix(theme): Document derived radius values"
```

---

### Task 3: Regenerate and verify the complete project

**Files:**

- Verify: `public/r/theme.json`
- Verify: `public/r/registry.json`
- Verify: all tracked changes from Tasks 1-2

- [ ] **Step 1: Rebuild registry artifacts**

```bash
bun run registry:build
```

Expected: generated theme JSON contains all seven comment-bearing radius
entries in `cssVars.theme`.

- [ ] **Step 2: Run static checks**

```bash
bun test
bun run typecheck
bun run lint
```

Expected: tests and typecheck exit `0`; lint has no errors. Existing unrelated
lint warnings may remain.

- [ ] **Step 3: Run the full build**

```bash
bun run build
```

Expected: Next compilation, static generation, registry generation, and export
verification complete successfully.

- [ ] **Step 4: Review the final diff**

```bash
git diff --check
git status --short --branch
git diff --stat HEAD~2..HEAD
```

Expected: only the radius source, registry, and focused test changes are
present; generated `public/r` files remain ignored.
