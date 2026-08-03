# Stepper Variant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add semantic Stepper color variants, remove raw state color classes from rendered demos, and document the new API in both locales.

**Architecture:** `Stepper` owns `variant` and `activeVariant` in context. `StepperIndicator` consumes both values through a `cva` recipe, while `StepperSeparator` consumes the base variant for completed connectors. Existing usages remain compatible through `variant="default"`, and demos that currently show primary-active/success-completed use `variant="success" activeVariant="default"`.

**Tech Stack:** React 19, TypeScript, Base UI, `class-variance-authority`, Tailwind CSS, Bun test, Next.js 16.

## Global Constraints

- Public variants are `"default" | "info" | "success" | "warning" | "destructive"` in that order; `primary` remains an internal theme token mapped from `default`.
- `activeVariant` defaults to `variant`.
- Inactive styling remains muted and is not affected by `activeVariant`.
- Preserve existing Stepper components, controlled state, loading indicators, panel behavior, and generated IDs.
- Use `cva` with `cn`; use `text-primary-foreground` for `default` and `text-white` for the other semantic variants; do not add new theme tokens or dependencies.
- Update both `content/docs/components/stepper.mdx` and `.ko.mdx` where examples demonstrate state colors.

---

### Task 1: Add failing variant behavior tests

**Files:**

- Modify: `components/ui/stepper.test.tsx`
- Test: `components/ui/stepper.test.tsx`

**Interfaces:**

- Consumes: current `Stepper` exports.
- Produces: executable assertions for all five semantic variants and the active override recipe.

- [ ] **Step 1: Write the failing tests**

Add tests using `renderToStaticMarkup` that render a minimal Stepper with one completed item and one active item. Assert that:

1. The default variant includes primary active/completed classes.
2. `variant="info"`, `variant="success"`, `variant="warning"`, and `variant="destructive"` include their corresponding active/completed classes.
3. `variant="success" activeVariant="default"` includes success completed classes and primary active classes.
4. The separator receives the base completed variant class.

Keep the existing accessibility, loading, panel, and ID tests unchanged.

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```bash
bun test components/ui/stepper.test.tsx
```

Expected: the new variant assertions fail because `Stepper` does not yet accept or consume variant props.

---

### Task 2: Implement the Stepper variant API

**Files:**

- Modify: `components/ui/stepper.tsx:1`
- Test: `components/ui/stepper.test.tsx`

**Interfaces:**

- Consumes: failing tests from Task 1.
- Produces: exported `StepperVariant`, `StepperProps.variant`, `StepperProps.activeVariant`, and context-driven indicator/separator recipes.

- [ ] **Step 1: Add the public variant type and context values**

Define and export:

```ts
type StepperVariant = "default" | "info" | "success" | "warning" | "destructive"
```

Add `variant?: StepperVariant` and `activeVariant?: StepperVariant` to `StepperProps`. Default `variant` to `"default"`; pass `activeVariant ?? variant` through `StepperContextValue`.

- [ ] **Step 2: Add `cva` recipes for indicators and separators**

Add a `StepperIndicator` recipe with these state mappings:

- `default`: active and completed use `bg-primary` and `text-primary-foreground`.
- `success`: active and completed use `bg-success` and `text-white`.
- `activeVariant` overrides only active background/text classes.
- inactive remains `text-muted-foreground`.

Add a separator recipe where the completed connector uses the corresponding semantic token: `bg-primary` for `default`, then `bg-info`, `bg-success`, `bg-warning`, and `bg-destructive`; preserve existing geometry and style-specific classes.

- [ ] **Step 3: Consume context in visual primitives and export the type**

Remove hard-coded state color policy from the Indicator and Separator default class strings. Compose the `cva` output with consumer `className` through `cn`, and export `StepperVariant` alongside the existing public types.

- [ ] **Step 4: Run the focused tests and verify they pass**

Run:

```bash
bun test components/ui/stepper.test.tsx
```

Expected: all existing tests and the new variant assertions pass.

---

### Task 3: Migrate rendered Stepper demos

**Files:**

- Modify: `components/demos/stepper-states.tsx`
- Modify: `components/demos/stepper-indicators.tsx`
- Modify: `components/demos/stepper-controlled.tsx`
- Modify: `components/demos/stepper-title-status.tsx`
- Modify: `components/demos/stepper-vertical.tsx`
- Modify: `components/demos/stepper-vertical-title.tsx`
- Modify: `components/demos/stepper-vertical-title-description.tsx`
- Modify: any remaining `components/demos/stepper-*.tsx` file containing state-specific color utilities

**Interfaces:**

- Consumes: the variant API from Task 2.
- Produces: demos whose state colors are controlled by Stepper props rather than raw `bg-green-500`/`data-[state]` color classes.

- [ ] **Step 1: Add the root variant props to demos that preserve the existing two-color appearance**

Use:

```tsx
<Stepper variant="success" activeVariant="default">
```

for demos that currently show primary active and success completed states.

- [ ] **Step 2: Remove duplicated state color classes**

Remove direct state color utilities from Indicator and Separator `className` values. Keep size, border width, layout, inactive-border, positioning, and other geometry classes.

- [ ] **Step 3: Search for remaining raw state colors**

Run:

```bash
rg -n 'green-500|data-\[state=(active|completed)\].*(bg|text|border)|group-data-\[state=completed\].*bg-' components/demos/stepper-*.tsx
```

Expected: no remaining raw active/completed color overrides in Stepper demos.

---

### Task 4: Update English and Korean documentation examples

**Files:**

- Modify: `content/docs/components/stepper.mdx`
- Modify: `content/docs/components/stepper.ko.mdx`

**Interfaces:**

- Consumes: the public `variant` and `activeVariant` API from Task 2.
- Produces: documentation code examples that teach the new API and do not teach raw color overrides.

- [ ] **Step 1: Update state-color examples in English**

Where the examples communicate active-primary/completed-success styling, add `variant="success" activeVariant="default"` to the root Stepper. Keep examples without state-color customization on the default variant.

- [ ] **Step 2: Mirror the same API in Korean**

Apply the same prop examples and behavior descriptions in the Korean page while preserving Korean user-visible copy.

- [ ] **Step 3: Update the API reference**

Document `StepperVariant`, `variant`, and `activeVariant`, including the rule that `activeVariant` defaults to `variant` and only changes the active state.

---

### Task 5: Verify the complete change

**Files:**

- Verify: all files changed by Tasks 1–4.

- [ ] **Step 1: Run focused tests**

```bash
bun test components/ui/stepper.test.tsx
```

Expected: all Stepper tests pass.

- [ ] **Step 2: Run typecheck and lint**

```bash
bun run typecheck
bunx eslint components/ui/stepper.tsx components/ui/stepper.test.tsx components/demos/stepper-*.tsx
```

Expected: no type or lint errors.

- [ ] **Step 3: Check registration and build**

```bash
python3 .claude/skills/add-component/scripts/check-registration.py stepper
npm run build
```

Expected: registration check passes and the production build completes successfully.

- [ ] **Step 4: Inspect the final diff**

```bash
git diff --check
git status --short
git diff --stat
```

Expected: only the Stepper implementation, tests, demos, docs, and this plan/spec are changed; no generated or unrelated files are included.
