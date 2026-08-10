# Questionnaire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the upstream Base UI Questionnaire in ondo-ui with its complete styled API, all 14 examples, bilingual documentation, registry/site registration, and `1.6.0` release metadata.

**Architecture:** `components/ui/questionnaire.tsx` is a thin styled wrapper around `@shadcn/react/questionnaire`; the package owns state, validation, keyboard behavior, SSR collection state, and form serialization. Ondo-ui owns Tailwind presentation, Button composition, Tabler icons, demos, documentation, registration, and release metadata.

**Tech Stack:** Next.js 16.2 App Router, React 19.2, TypeScript 5.9, Tailwind CSS 4, `@shadcn/react` 0.3+, Base UI Button composition, Tabler Icons, Bun test/build tooling, Fumadocs MDX, Changesets.

## Global Constraints

- Use `/Users/initred/Code/ui/packages/react/src/questionnaire` as the headless behavior/type source and `/Users/initred/Code/ui/apps/v4/registry/bases/base/ui/questionnaire.tsx` plus the resolved `base-vega` registry item as the visual source.
- Keep the public export names, upstream interaction behavior, visible copy, layout, and all 14 Base UI examples.
- Only adapt imports, default exports, toast calls, Tabler icons, ondo registry paths, MDX integration, and release metadata.
- Require `@shadcn/react` `^0.3.0` or newer; do not copy the headless primitive or its upstream test suite.
- Use Base UI `render`; do not introduce Radix, `Slot`, or `asChild`.
- Use semantic Tailwind tokens and self-contained utility classes; add no Questionnaire theme variable or global Questionnaire stylesheet.
- Every demo file has one default export and no props.
- Keep every registration list alphabetical.
- The public changelog version is `1.6.0`; add a minor Changeset for `@dou.so/ondo-ui` and leave version application to the release workflow.
- `components/ui/questionnaire.contract.test.tsx` is temporary. It must be deleted after the complete verification run, and the final commit must contain no Questionnaire-specific test file.
- Read `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` before writing the Client Component, as required by `AGENTS.md`.

## File Structure

**Create:**

- `components/ui/questionnaire.tsx` — styled public wrapper around the headless primitive.
- `components/ui/questionnaire.contract.test.tsx` — temporary export/file/docs/release contract; deleted in Task 8.
- `components/demos/questionnaire-demo.tsx`
- `components/demos/questionnaire-animated.tsx`
- `components/demos/questionnaire-card.tsx`
- `components/demos/questionnaire-conditional.tsx`
- `components/demos/questionnaire-controlled.tsx`
- `components/demos/questionnaire-dialog.tsx`
- `components/demos/questionnaire-freeform.tsx`
- `components/demos/questionnaire-multiple.tsx`
- `components/demos/questionnaire-navigation-state.tsx`
- `components/demos/questionnaire-progress.tsx`
- `components/demos/questionnaire-resume.tsx`
- `components/demos/questionnaire-shortcuts.tsx`
- `components/demos/questionnaire-skip.tsx`
- `components/demos/questionnaire-validation.tsx`
- `content/docs/components/questionnaire.mdx`
- `content/docs/components/questionnaire.ko.mdx`
- `.changeset/questionnaire.md`
- `content/docs/changelog/2026-08-10-questionnaire.mdx`
- `content/docs/changelog/2026-08-10-questionnaire.ko.mdx`

**Modify:**

- `package.json` — upgrade `@shadcn/react`; add direct `zod` dependency for the validation demo.
- `bun.lock` — lock dependency changes.
- `components/demos/index.tsx:315` and `components/demos/index.tsx:763` — import and register all Questionnaire demos.
- `content/docs/components/meta.json:57` — add the docs page.
- `registry.json` — add the `registry:ui` item.
- `lib/components-list.ts:384` — add gallery metadata.
- `packages/design-inspector/src/catalog.ts:50` — add the component name.

---

### Task 1: Add the dependency and styled wrapper

**Files:**

- Create: `components/ui/questionnaire.contract.test.tsx`
- Create: `components/ui/questionnaire.tsx`
- Modify: `package.json`
- Modify: `bun.lock`
- Reference: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- Reference: `/Users/initred/Code/ui/apps/v4/registry/bases/base/ui/questionnaire.tsx`

**Interfaces:**

- Consumes: `Questionnaire` primitive namespace from `@shadcn/react/questionnaire`; `buttonVariants` and `Button` from `@/components/ui/button`; `cn` from `@/lib/utils`; `IconCheck` from `@tabler/icons-react`.
- Produces: the 15 styled Questionnaire exports listed in the temporary contract below. Demos and docs in later tasks import only these names.

- [ ] **Step 1: Read the local Next.js Client Component directive guide**

Read the entire file:

```text
node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md
```

Confirm that `"use client"` is the first statement in both the wrapper and all interactive demos.

- [ ] **Step 2: Create the complete temporary contract test**

Use `apply_patch` to create `components/ui/questionnaire.contract.test.tsx` with this exact content:

```tsx
import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import * as QuestionnaireModule from "./questionnaire"

const root = process.cwd()

const foundationDemos = [
  "questionnaire-demo",
  "questionnaire-freeform",
  "questionnaire-multiple",
  "questionnaire-shortcuts",
  "questionnaire-skip",
] as const

const stateDemos = [
  "questionnaire-conditional",
  "questionnaire-controlled",
  "questionnaire-navigation-state",
  "questionnaire-resume",
  "questionnaire-validation",
] as const

const compositionDemos = [
  "questionnaire-animated",
  "questionnaire-card",
  "questionnaire-dialog",
  "questionnaire-progress",
] as const

const allDemos = [
  ...foundationDemos,
  ...stateDemos,
  ...compositionDemos,
] as const

function expectDemoFiles(names: readonly string[]) {
  for (const name of names) {
    expect(existsSync(join(root, "components/demos", `${name}.tsx`))).toBe(true)
  }
}

describe("Questionnaire delivery contract", () => {
  test("exports the upstream styled parts", () => {
    expect(Object.keys(QuestionnaireModule).sort()).toEqual(
      [
        "Questionnaire",
        "QuestionnaireActions",
        "QuestionnaireChoice",
        "QuestionnaireChoiceDescription",
        "QuestionnaireChoices",
        "QuestionnaireDescription",
        "QuestionnaireError",
        "QuestionnaireInput",
        "QuestionnaireItem",
        "QuestionnaireNext",
        "QuestionnairePrevious",
        "QuestionnaireProgress",
        "QuestionnaireSkip",
        "QuestionnaireSubmit",
        "QuestionnaireTitle",
      ].sort()
    )
  })

  test("ports the foundation examples", () => {
    expectDemoFiles(foundationDemos)
  })

  test("ports the state examples", () => {
    expectDemoFiles(stateDemos)
  })

  test("ports the composition examples", () => {
    expectDemoFiles(compositionDemos)
  })

  test("registers every demo and documentation preview", () => {
    const demosIndex = readFileSync(
      join(root, "components/demos/index.tsx"),
      "utf8"
    )

    for (const name of allDemos) {
      expect(demosIndex).toContain(`"${name}":`)
    }

    for (const filename of ["questionnaire.mdx", "questionnaire.ko.mdx"]) {
      const docsPath = join(root, "content/docs/components", filename)
      expect(existsSync(docsPath)).toBe(true)
      const docs = readFileSync(docsPath, "utf8")

      for (const name of allDemos) {
        expect(docs).toContain(`name="${name}"`)
      }
    }
  })

  test("writes bilingual release metadata", () => {
    const changeset = readFileSync(
      join(root, ".changeset/questionnaire.md"),
      "utf8"
    )
    expect(changeset).toContain('"@dou.so/ondo-ui": minor')

    for (const filename of [
      "2026-08-10-questionnaire.mdx",
      "2026-08-10-questionnaire.ko.mdx",
    ]) {
      const changelog = readFileSync(
        join(root, "content/docs/changelog", filename),
        "utf8"
      )
      expect(changelog).toContain("version: 1.6.0")
      expect(changelog).toContain("**v1.6.0**")
    }
  })
})
```

- [ ] **Step 3: Run the export contract and verify the red state**

Run:

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "exports the upstream styled parts"
```

Expected: FAIL because `components/ui/questionnaire.tsx` does not exist.

- [ ] **Step 4: Upgrade runtime dependencies**

Run:

```bash
bun add @shadcn/react@^0.3.0 zod@^4.4.3
```

Confirm `package.json` contains:

```json
"@shadcn/react": "^0.3.0",
"zod": "^4.4.3"
```

- [ ] **Step 5: Create the styled wrapper from the upstream Base UI source**

Use `apply_patch` to add the upstream wrapper from
`/Users/initred/Code/ui/apps/v4/registry/bases/base/ui/questionnaire.tsx`, then
make these exact import substitutions:

```diff
 import * as React from "react"
 import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
+import { IconCheck } from "@tabler/icons-react"

-import { cn } from "@/registry/bases/base/lib/utils"
-import { buttonVariants, type Button } from "@/registry/bases/base/ui/button"
-import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
+import { cn } from "@/lib/utils"
+import { buttonVariants, type Button } from "@/components/ui/button"
```

Replace the upstream `IconPlaceholder` element with:

```tsx
<IconCheck
  data-slot="questionnaire-choice-indicator-check"
  className="hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
/>
```

Remove the unresolved `cn-questionnaire*` marker classes and merge the resolved
Base Vega utilities into their owning elements. The final class values are:

```text
Questionnaire: flex w-full min-w-0 flex-col gap-6
Progress: min-h-[1lh] w-fit min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums
Item: flex min-w-0 flex-col gap-5 border-0 p-0 outline-none
Title: font-heading text-base font-semibold text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-5
Description: text-sm text-pretty text-muted-foreground
Choices: group/questionnaire-choices grid min-w-0 gap-3
Choice: group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-input bg-transparent px-4 py-3.5 text-start text-sm shadow-xs transition-colors outline-none select-none hover:bg-muted/50 has-[>input:focus-visible]:border-ring has-[>input:focus-visible]:ring-3 has-[>input:focus-visible]:ring-ring/50 data-invalid:border-destructive dark:bg-input/20 data-checked:border-primary/40 data-checked:bg-muted dark:data-checked:bg-muted
Choice disabled state: data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50
ChoiceInput: absolute inset-0 z-10 size-full cursor-pointer opacity-0
Choice indicator: pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-[4px] border border-input group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[type=radio]/questionnaire-choice:rounded-full group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-primary-foreground dark:bg-input/30 dark:group-data-checked/questionnaire-choice:bg-primary
Choice dot: hidden size-2 rounded-full bg-primary-foreground group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block
Choice label/content: flex min-w-0 flex-1 flex-col gap-1 leading-snug
Choice shortcut: pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-md border border-input bg-background font-mono text-[0.625rem] leading-none font-medium text-muted-foreground shadow-xs group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[shortcut]/questionnaire-choice:inline-flex
ChoiceDescription: text-muted-foreground
Input wrapper: group/questionnaire-input relative w-full min-w-0
Input: h-9 min-h-11 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 sm:min-h-0 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40
Input selection/placeholder: selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground
Error: text-sm text-destructive
Actions: grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-9
Previous: col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0
Skip: col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0
Next/Submit: col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0
```

Keep the upstream prop types and defaults exactly: Previous and Skip use
`variant="outline"`; Next and Submit use `variant="default"`; all four use
`size="default"` and retain their English fallback labels.

- [ ] **Step 6: Format and verify the green state**

Run:

```bash
bunx prettier --write components/ui/questionnaire.tsx components/ui/questionnaire.contract.test.tsx
bun test components/ui/questionnaire.contract.test.tsx -t "exports the upstream styled parts"
bun run typecheck
```

Expected: the targeted contract test and typecheck PASS.

- [ ] **Step 7: Commit the wrapper and temporary contract**

```bash
git add package.json bun.lock components/ui/questionnaire.tsx components/ui/questionnaire.contract.test.tsx
git commit -m "feat(questionnaire): Add styled primitive wrapper"
```

---

### Task 2: Port the foundation examples

**Files:**

- Create: `components/demos/questionnaire-demo.tsx`
- Create: `components/demos/questionnaire-freeform.tsx`
- Create: `components/demos/questionnaire-multiple.tsx`
- Create: `components/demos/questionnaire-shortcuts.tsx`
- Create: `components/demos/questionnaire-skip.tsx`
- Test: `components/ui/questionnaire.contract.test.tsx`
- Reference: `/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-{demo,freeform,multiple,shortcuts,skip}.tsx`

**Interfaces:**

- Consumes: all styled exports from Task 1; `toast.add` from `@/components/ui/toast`; `NativeSelect` for shortcuts; `QuestionnaireItemStatus` for explicit skip state.
- Produces: default-exported demos covering the lead flow, freeform answers, multiple answers, selectable shortcut mode, and explicit skip state.

- [ ] **Step 1: Run the foundation demo contract and verify the red state**

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "ports the foundation examples"
```

Expected: FAIL because the five destination files do not exist.

- [ ] **Step 2: Create the five demos from their exact upstream files**

Use `apply_patch` for each source-to-destination mapping:

```text
/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-demo.tsx
  -> components/demos/questionnaire-demo.tsx
  -> default export name: QuestionnaireDemo

/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-freeform.tsx
  -> components/demos/questionnaire-freeform.tsx
  -> default export name: QuestionnaireFreeform

/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-multiple.tsx
  -> components/demos/questionnaire-multiple.tsx
  -> default export name: QuestionnaireMultiple

/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-shortcuts.tsx
  -> components/demos/questionnaire-shortcuts.tsx
  -> default export name: QuestionnaireShortcuts

/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-skip.tsx
  -> components/demos/questionnaire-skip.tsx
  -> default export name: QuestionnaireSkipExample
```

Preserve every `items` definition, label, description, value, prop, event
handler, layout class, and `FormData` read. Apply these exact path/export
changes:

```diff
-import { toast } from "sonner"
+import { toast } from "@/components/ui/toast"

-} from "@/styles/base-nova/ui/questionnaire"
+} from "@/components/ui/questionnaire"

-} from "@/styles/base-nova/ui/native-select"
+} from "@/components/ui/native-select"

-export function QuestionnaireDemo() {
+export default function QuestionnaireDemo() {
```

Apply the matching `export default function` change to all five named exports.
Keep the `QuestionnaireItemStatus` type import from
`@shadcn/react/questionnaire` in the skip demo.

- [ ] **Step 3: Convert Sonner calls without changing visible content**

For each `toast("Title", { description })`, use the ondo Base UI toast manager:

```diff
-toast("Agent plan saved", {
-  description: result,
-})
+toast.add({
+  title: "Agent plan saved",
+  description: result,
+})
```

Apply that object shape to the exact existing title and description expression
in every file. The skip, multiple, freeform, shortcuts, and lead demos must show
the same messages as upstream.

- [ ] **Step 4: Format and verify the five demos**

```bash
bunx prettier --write components/demos/questionnaire-demo.tsx components/demos/questionnaire-freeform.tsx components/demos/questionnaire-multiple.tsx components/demos/questionnaire-shortcuts.tsx components/demos/questionnaire-skip.tsx
bun test components/ui/questionnaire.contract.test.tsx -t "ports the foundation examples"
bunx eslint components/demos/questionnaire-demo.tsx components/demos/questionnaire-freeform.tsx components/demos/questionnaire-multiple.tsx components/demos/questionnaire-shortcuts.tsx components/demos/questionnaire-skip.tsx
bun run typecheck
```

Expected: all commands PASS.

- [ ] **Step 5: Commit the foundation demos**

```bash
git add components/demos/questionnaire-demo.tsx components/demos/questionnaire-freeform.tsx components/demos/questionnaire-multiple.tsx components/demos/questionnaire-shortcuts.tsx components/demos/questionnaire-skip.tsx
git commit -m "docs(questionnaire): Add foundation examples"
```

---

### Task 3: Port the state and validation examples

**Files:**

- Create: `components/demos/questionnaire-conditional.tsx`
- Create: `components/demos/questionnaire-controlled.tsx`
- Create: `components/demos/questionnaire-navigation-state.tsx`
- Create: `components/demos/questionnaire-resume.tsx`
- Create: `components/demos/questionnaire-validation.tsx`
- Test: `components/ui/questionnaire.contract.test.tsx`
- Reference: `/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-{conditional,controlled,navigation-state,resume,validation}.tsx`

**Interfaces:**

- Consumes: Task 1 wrapper, ondo Button/Card/Toast, `QuestionnaireItemStatus`, and direct `zod` dependency.
- Produces: default-exported demos for dynamic item enablement, controlled navigation, item status, saved defaults/reset, and external schema validation.

- [ ] **Step 1: Run the state demo contract and verify the red state**

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "ports the state examples"
```

Expected: FAIL because the five state-demo files do not exist.

- [ ] **Step 2: Create the five demos from their exact upstream files**

Use `apply_patch` for these mappings:

```text
questionnaire-conditional.tsx -> QuestionnaireConditional
questionnaire-controlled.tsx -> QuestionnaireControlled
questionnaire-navigation-state.tsx -> QuestionnaireNavigationState
questionnaire-resume.tsx -> QuestionnaireResume
questionnaire-validation.tsx -> QuestionnaireValidation
```

Every source comes from
`/Users/initred/Code/ui/apps/v4/examples/base/` and every destination uses the
same basename under `components/demos/`. Preserve the upstream state types,
`items` arrays, Zod schema and `superRefine`, error mapping, reset behavior,
controlled `item`/`onItemChange`, conditional `disabled` item, and all visible
copy.

Apply these exact import/export changes:

```diff
-import { toast } from "sonner"
+import { toast } from "@/components/ui/toast"

-} from "@/styles/base-nova/ui/questionnaire"
+} from "@/components/ui/questionnaire"

-import { Button } from "@/styles/base-nova/ui/button"
+import { Button } from "@/components/ui/button"

-} from "@/styles/base-nova/ui/card"
+} from "@/components/ui/card"

-export function QuestionnaireValidation() {
+export default function QuestionnaireValidation() {
```

Apply the matching default-export change to every named function. Retain
`import type { QuestionnaireItemStatus } from "@shadcn/react/questionnaire"`
where present and retain `import { z } from "zod"` in validation.

- [ ] **Step 3: Convert all toast calls to the ondo manager**

Use the exact upstream title and description, changing only the call shape. For
the controlled example, the resulting call is:

```tsx
toast.add({
  title: "Agent workflow configured",
  description: `Scope: ${formData.get("scope") ?? "None"} · Verification: ${formData.get("checks") ?? "None"} · Output: ${formData.get("output") ?? "None"}`,
})
```

For the resume reset handler, use:

```tsx
onReset={() => toast.add({ title: "Saved answers restored" })}
```

The success branch in validation calls `toast.add` only after the Zod result
succeeds; the invalid branch continues to set the active item and error map.

- [ ] **Step 4: Format and verify the state demos**

```bash
bunx prettier --write components/demos/questionnaire-conditional.tsx components/demos/questionnaire-controlled.tsx components/demos/questionnaire-navigation-state.tsx components/demos/questionnaire-resume.tsx components/demos/questionnaire-validation.tsx
bun test components/ui/questionnaire.contract.test.tsx -t "ports the state examples"
bunx eslint components/demos/questionnaire-conditional.tsx components/demos/questionnaire-controlled.tsx components/demos/questionnaire-navigation-state.tsx components/demos/questionnaire-resume.tsx components/demos/questionnaire-validation.tsx
bun run typecheck
```

Expected: all commands PASS, including Zod type checking.

- [ ] **Step 5: Commit the state demos**

```bash
git add components/demos/questionnaire-conditional.tsx components/demos/questionnaire-controlled.tsx components/demos/questionnaire-navigation-state.tsx components/demos/questionnaire-resume.tsx components/demos/questionnaire-validation.tsx
git commit -m "docs(questionnaire): Add state and validation examples"
```

---

### Task 4: Port the composition and presentation examples

**Files:**

- Create: `components/demos/questionnaire-animated.tsx`
- Create: `components/demos/questionnaire-card.tsx`
- Create: `components/demos/questionnaire-dialog.tsx`
- Create: `components/demos/questionnaire-progress.tsx`
- Test: `components/ui/questionnaire.contract.test.tsx`
- Reference: `/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-{animated,card,dialog,progress}.tsx`

**Interfaces:**

- Consumes: Task 1 wrapper, ondo Card/Dialog/Button/Toast, and primitive `render` state.
- Produces: the final four default-exported demos, completing all 14 upstream examples.

- [ ] **Step 1: Run the composition contract and verify the red state**

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "ports the composition examples"
```

Expected: FAIL because the four composition-demo files do not exist.

- [ ] **Step 2: Create the four demos from their exact upstream files**

Use `apply_patch` for these source/destination/default-export mappings:

```text
/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-animated.tsx
  -> components/demos/questionnaire-animated.tsx
  -> QuestionnaireAnimated
/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-card.tsx
  -> components/demos/questionnaire-card.tsx
  -> QuestionnaireCard
/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-dialog.tsx
  -> components/demos/questionnaire-dialog.tsx
  -> QuestionnaireDialog
/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-progress.tsx
  -> components/demos/questionnaire-progress.tsx
  -> QuestionnaireProgressExample
```

Preserve animation utilities and `motion-reduce`, Card slot composition,
Dialog open/close ownership and `render` props, custom progress render state,
all item definitions, and visible copy. Apply only these import/export changes:

```diff
-import { toast } from "sonner"
+import { toast } from "@/components/ui/toast"
-import { Button } from "@/styles/base-nova/ui/button"
+import { Button } from "@/components/ui/button"
-} from "@/styles/base-nova/ui/card"
+} from "@/components/ui/card"
-} from "@/styles/base-nova/ui/dialog"
+} from "@/components/ui/dialog"
-} from "@/styles/base-nova/ui/questionnaire"
+} from "@/components/ui/questionnaire"
-export function QuestionnaireDialog() {
+export default function QuestionnaireDialog() {
```

Apply the matching default-export change to the other three functions.

- [ ] **Step 3: Convert composition toast calls**

Replace each Sonner call with the ondo object API while preserving the exact
title and interpolated description. For the Dialog example, the resulting call
is:

```tsx
toast.add({
  title: "Clarification sent",
  description: `Scope: ${formData.get("scope") ?? "None"} · Verification: ${formData.get("tests") ?? "None"}`,
})
```

- [ ] **Step 4: Format and verify the composition demos**

```bash
bunx prettier --write components/demos/questionnaire-animated.tsx components/demos/questionnaire-card.tsx components/demos/questionnaire-dialog.tsx components/demos/questionnaire-progress.tsx
bun test components/ui/questionnaire.contract.test.tsx -t "ports the composition examples"
bunx eslint components/demos/questionnaire-animated.tsx components/demos/questionnaire-card.tsx components/demos/questionnaire-dialog.tsx components/demos/questionnaire-progress.tsx
bun run typecheck
```

Expected: all commands PASS.

- [ ] **Step 5: Commit the composition demos**

```bash
git add components/demos/questionnaire-animated.tsx components/demos/questionnaire-card.tsx components/demos/questionnaire-dialog.tsx components/demos/questionnaire-progress.tsx
git commit -m "docs(questionnaire): Add composition examples"
```

---

### Task 5: Register the demos and write bilingual component docs

**Files:**

- Modify: `components/demos/index.tsx:315`
- Modify: `components/demos/index.tsx:763`
- Create: `content/docs/components/questionnaire.mdx`
- Create: `content/docs/components/questionnaire.ko.mdx`
- Test: `components/ui/questionnaire.contract.test.tsx`
- Reference: `/Users/initred/Code/ui/apps/v4/content/docs/components/base/questionnaire.mdx`

**Interfaces:**

- Consumes: all 14 default exports from Tasks 2–4 and `ComponentPreview`'s `name`, `align`, and `previewClassName` props.
- Produces: 14 resolvable demo keys and complete English/Korean docs pages that use the same preview sequence.

- [ ] **Step 1: Run the docs/registration contract and verify the red state**

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "registers every demo and documentation preview"
```

Expected: FAIL because the demo map entries and docs files are absent.

- [ ] **Step 2: Register all demos alphabetically**

Insert these imports after the Progress imports and before Radio Group imports:

```tsx
import QuestionnaireAnimated from "@/components/demos/questionnaire-animated"
import QuestionnaireCard from "@/components/demos/questionnaire-card"
import QuestionnaireConditional from "@/components/demos/questionnaire-conditional"
import QuestionnaireControlled from "@/components/demos/questionnaire-controlled"
import QuestionnaireDemo from "@/components/demos/questionnaire-demo"
import QuestionnaireDialog from "@/components/demos/questionnaire-dialog"
import QuestionnaireFreeform from "@/components/demos/questionnaire-freeform"
import QuestionnaireMultiple from "@/components/demos/questionnaire-multiple"
import QuestionnaireNavigationState from "@/components/demos/questionnaire-navigation-state"
import QuestionnaireProgressExample from "@/components/demos/questionnaire-progress"
import QuestionnaireResume from "@/components/demos/questionnaire-resume"
import QuestionnaireShortcuts from "@/components/demos/questionnaire-shortcuts"
import QuestionnaireSkipExample from "@/components/demos/questionnaire-skip"
import QuestionnaireValidation from "@/components/demos/questionnaire-validation"
```

Insert these map entries after `progress-variants` and before `radio-group-*`:

```tsx
"questionnaire-animated": QuestionnaireAnimated,
"questionnaire-card": QuestionnaireCard,
"questionnaire-conditional": QuestionnaireConditional,
"questionnaire-controlled": QuestionnaireControlled,
"questionnaire-demo": QuestionnaireDemo,
"questionnaire-dialog": QuestionnaireDialog,
"questionnaire-freeform": QuestionnaireFreeform,
"questionnaire-multiple": QuestionnaireMultiple,
"questionnaire-navigation-state": QuestionnaireNavigationState,
"questionnaire-progress": QuestionnaireProgressExample,
"questionnaire-resume": QuestionnaireResume,
"questionnaire-shortcuts": QuestionnaireShortcuts,
"questionnaire-skip": QuestionnaireSkipExample,
"questionnaire-validation": QuestionnaireValidation,
```

- [ ] **Step 3: Create the complete English documentation page**

Use `apply_patch` to port the complete upstream page from
`/Users/initred/Code/ui/apps/v4/content/docs/components/base/questionnaire.mdx`.
Use this frontmatter:

```mdx
---
title: Questionnaire
description: A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.
---
```

Preserve the upstream Usage code, composition tree, server-rendering guidance,
accessibility guidance, and all example prose. Apply these exact documentation
adaptations:

```diff
-  styleName="base-nova"
```

Remove that prop from every preview. Replace the upstream CodeTabs/manual-copy
Installation block, which depends on shadcn-site-only MDX components, with:

````mdx
## Installation

```bash
bunx shadcn@latest add @ondo-ui/questionnaire
```

### Manual installation

Install the headless primitive and icon dependency:

```bash
bun add @shadcn/react@^0.3.0 @tabler/icons-react
```

Questionnaire also imports `buttonVariants` from
`@/components/ui/button` and `cn` from `@/lib/utils`. Add
`@ondo-ui/button` and `@ondo-ui/utils`, then copy
`components/ui/questionnaire.tsx` into the same path in your project.
````

Replace the usage import path with
`@/components/ui/questionnaire`. Replace internal upstream-only links with:

```md
[headless Questionnaire](https://ui.shadcn.com/docs/react/questionnaire)
[@shadcn/react Questionnaire API](https://ui.shadcn.com/docs/react/questionnaire#api-reference)
```

Keep this exact preview order and upstream `align`/`previewClassName` values:

```text
questionnaire-demo
questionnaire-multiple
questionnaire-freeform
questionnaire-skip
questionnaire-shortcuts
questionnaire-validation
questionnaire-controlled
questionnaire-resume
questionnaire-conditional
questionnaire-navigation-state
questionnaire-progress
questionnaire-animated
questionnaire-card
questionnaire-dialog
```

- [ ] **Step 4: Create the Korean documentation page with matching coverage**

Use this frontmatter:

```mdx
---
title: Questionnaire (설문)
description: 단일 선택, 다중 선택, 자유 입력 및 건너뛰기를 지원하는 다단계 설문 컴포넌트입니다.
---
```

Keep the same code identifiers, API names, preview order, `align`, and
`previewClassName` values as English. Translate every explanatory paragraph and
these section headings consistently:

```text
Installation -> 설치
Usage -> 사용법
Composition -> 구성
Server Rendering -> 서버 렌더링
Multiple Selection -> 다중 선택
Freeform Answer -> 자유 입력 답변
Explicit Skip -> 명시적 건너뛰기
Shortcuts -> 단축키
Custom Validation -> 사용자 지정 검증
Controlled -> 제어
Resume -> 이어하기
Conditional Items -> 조건부 항목
Navigation State -> 내비게이션 상태
Custom Progress -> 사용자 지정 진행률
Animated Items -> 애니메이션 항목
Accessibility -> 접근성
Unstyled -> 스타일 없는 Primitive
API Reference -> API 참고
```

The Korean installation command remains exactly:

```bash
bunx shadcn@latest add @ondo-ui/questionnaire
```

The Korean page also includes the same `수동 설치` subsection, dependency
command, required `@ondo-ui/button` and `@ondo-ui/utils` items, and destination
path without translating package names or file paths.

Translate user-visible strings in illustrative fenced code while retaining
prop names and values. `ComponentPreview` continues to display the registered
English demo file, matching the repository convention.

- [ ] **Step 5: Format and verify docs registration**

```bash
bunx prettier --write components/demos/index.tsx
bun test components/ui/questionnaire.contract.test.tsx -t "registers every demo and documentation preview"
bunx fumadocs-mdx
bun run typecheck
```

Expected: the contract test, MDX generation, and typecheck PASS.

- [ ] **Step 6: Commit demos registration and docs**

```bash
git add components/demos/index.tsx content/docs/components/questionnaire.mdx content/docs/components/questionnaire.ko.mdx
git commit -m "docs(questionnaire): Add bilingual documentation"
```

---

### Task 6: Register Questionnaire across the site and registry

**Files:**

- Modify: `content/docs/components/meta.json:57`
- Modify: `registry.json`
- Modify: `lib/components-list.ts:384`
- Modify: `packages/design-inspector/src/catalog.ts:50`
- Test: `.claude/skills/add-component/scripts/check-registration.py`
- Test: `packages/design-inspector/src/catalog.test.ts`

**Interfaces:**

- Consumes: the wrapper and docs from Tasks 1 and 5.
- Produces: docs sidebar entry, `@ondo-ui/questionnaire` registry item, `/components` gallery card, and Design Inspector recognition.

- [ ] **Step 1: Run the registration checker and verify the red state**

```bash
python3 .claude/skills/add-component/scripts/check-registration.py questionnaire
```

Expected: FAIL and report the missing sidebar, registry, gallery, and Design
Inspector catalog entries.

- [ ] **Step 2: Add the docs sidebar page**

Insert `"questionnaire"` in `content/docs/components/meta.json` after
`"progress-ring"` and before `"radio-group"`:

```json
"progress-ring",
"questionnaire",
"radio-group"
```

- [ ] **Step 3: Add the registry item**

Insert this object alphabetically after `progress-ring` and before
`radio-group` in `registry.json`:

```json
{
  "name": "questionnaire",
  "type": "registry:ui",
  "description": "A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.",
  "dependencies": ["@shadcn/react", "@tabler/icons-react"],
  "registryDependencies": ["@ondo-ui/button", "@ondo-ui/utils"],
  "files": [
    {
      "path": "components/ui/questionnaire.tsx",
      "type": "registry:ui"
    }
  ]
}
```

- [ ] **Step 4: Add the gallery entry**

Insert this object in `lib/components-list.ts` after `progress-ring` and before
`radio-group`:

```tsx
{
  name: "questionnaire",
  title: "Questionnaire",
  description: {
    en: "A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.",
    ko: "단일 선택, 다중 선택, 자유 입력 및 건너뛰기를 지원하는 다단계 설문 컴포넌트입니다.",
  },
},
```

- [ ] **Step 5: Add the Design Inspector catalog name**

Insert the string after `"progress-ring"` and before `"radio-group"`:

```tsx
"progress-ring",
"questionnaire",
"radio-group",
```

No `EXTRA_ROOT_SLOTS` entry is needed because the wrapper renders
`data-slot="questionnaire"` on its root form.

- [ ] **Step 6: Format and run registration tests**

```bash
bunx prettier --write registry.json lib/components-list.ts packages/design-inspector/src/catalog.ts
python3 .claude/skills/add-component/scripts/check-registration.py questionnaire
bun test packages/design-inspector/src/catalog.test.ts
bun run registry:build
```

Expected: checker reports `OK`, the catalog test PASSes, and registry build
creates `public/r/questionnaire.json`.

Inspect the generated item:

```bash
node -e 'const item=require("./public/r/questionnaire.json"); console.log(item.name, item.files.map((file)=>file.path), item.dependencies, item.registryDependencies)'
```

Expected output includes `questionnaire`, only
`components/ui/questionnaire.tsx`, both npm dependencies, and both namespaced
registry dependencies.

- [ ] **Step 7: Commit site and registry registration**

```bash
git add content/docs/components/meta.json registry.json lib/components-list.ts packages/design-inspector/src/catalog.ts
git commit -m "feat(questionnaire): Register component across ondo-ui"
```

---

### Task 7: Add Changeset and bilingual release notes

**Files:**

- Create: `.changeset/questionnaire.md`
- Create: `content/docs/changelog/2026-08-10-questionnaire.mdx`
- Create: `content/docs/changelog/2026-08-10-questionnaire.ko.mdx`
- Test: `components/ui/questionnaire.contract.test.tsx`

**Interfaces:**

- Consumes: completed component/docs/registry delivery from Tasks 1–6.
- Produces: a minor `@dou.so/ondo-ui` Changeset and public bilingual `1.6.0` release notes.

- [ ] **Step 1: Run the release metadata contract and verify the red state**

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "writes bilingual release metadata"
```

Expected: FAIL because `.changeset/questionnaire.md` and both changelog pages
do not exist.

- [ ] **Step 2: Create the minor Changeset**

Use `apply_patch` to create `.changeset/questionnaire.md`:

```md
---
"@dou.so/ondo-ui": minor
---

Add the Questionnaire registry component with multi-step navigation, fixed and freeform answers, validation, shortcuts, and complete bilingual documentation.
```

Do not edit `packages/ondo-ui-cli/package.json`; the Version Packages workflow
consumes the Changeset.

- [ ] **Step 3: Create the English changelog**

Use `apply_patch` with this exact content:

```mdx
---
title: Questionnaire
description: Add a multi-step questionnaire for fixed, freeform, multiple, and skippable answers.
version: 1.6.0
---

**v1.6.0**

- Add `Questionnaire`, a multi-step form composition built on the headless `@shadcn/react` primitive.
- Support single and multiple selection, freeform answers, explicit skipping, required and external validation, controlled navigation, saved defaults, conditional items, progress state, and letter or number shortcuts.
- Include all 14 upstream examples with Card and Dialog composition, animation, responsive layouts, and complete English and Korean documentation.
```

- [ ] **Step 4: Create the Korean changelog**

Use `apply_patch` with this exact content:

```mdx
---
title: Questionnaire
description: 고정 선택, 자유 입력, 다중 선택 및 건너뛰기를 지원하는 다단계 설문을 추가합니다.
version: 1.6.0
---

**v1.6.0**

- Headless `@shadcn/react` primitive를 기반으로 하는 다단계 폼 구성 요소 `Questionnaire`를 추가했습니다.
- 단일·다중 선택, 자유 입력, 명시적 건너뛰기, 필수 및 외부 검증, 제어형 내비게이션, 저장된 기본값, 조건부 항목, 진행 상태, 문자·숫자 단축키를 지원합니다.
- Card와 Dialog 구성, 애니메이션, 반응형 레이아웃을 포함한 원본 예제 14개와 영문·한글 전체 문서를 제공합니다.
```

- [ ] **Step 5: Verify release metadata and unchanged changelog navigation**

```bash
bun test components/ui/questionnaire.contract.test.tsx -t "writes bilingual release metadata"
bunx changeset status
git diff --exit-code -- content/docs/changelog/meta.json
```

Expected: contract test PASSes, Changesets reports a minor release for
`@dou.so/ondo-ui`, and `changelog/meta.json` has no diff.

- [ ] **Step 6: Commit release metadata**

```bash
git add .changeset/questionnaire.md content/docs/changelog/2026-08-10-questionnaire.mdx content/docs/changelog/2026-08-10-questionnaire.ko.mdx
git commit -m "docs: Add Questionnaire release notes (v1.6.0)"
```

---

### Task 8: Run full verification, visual QA, and remove the temporary test

**Files:**

- Delete: `components/ui/questionnaire.contract.test.tsx`
- Verify: every file created or modified in Tasks 1–7

**Interfaces:**

- Consumes: the complete Questionnaire release candidate and temporary contract.
- Produces: a fully verified working tree with no Questionnaire-specific test file.

- [ ] **Step 1: Run the complete automated verification while the temporary contract still exists**

Run in this order:

```bash
python3 .claude/skills/add-component/scripts/check-registration.py questionnaire
python3 .claude/skills/add-component/scripts/check-registration.py
bun test
bun run typecheck
bunx eslint components/ui/questionnaire.tsx components/demos/questionnaire-*.tsx components/demos/index.tsx packages/design-inspector/src/catalog.ts
bun run build
```

Expected:

```text
Questionnaire registration: OK
All component registrations: OK
All Bun tests: PASS
TypeScript: PASS with no errors
ESLint: PASS with no errors
Production build/export verification: PASS
```

- [ ] **Step 2: Inspect the built registry contract**

Run:

```bash
node -e 'const item=require("./public/r/questionnaire.json"); if(item.files.length!==1||item.files[0].path!=="components/ui/questionnaire.tsx") process.exit(1); console.log(item)'
```

Expected: exit code 0; the built item has one UI file, npm dependencies
`@shadcn/react` and `@tabler/icons-react`, and registry dependencies
`@ondo-ui/button` and `@ondo-ui/utils`.

- [ ] **Step 3: Run desktop and mobile visual QA**

Start the local site:

```bash
bun run dev
```

Open both component pages:

```text
http://localhost:3000/docs/components/questionnaire
http://localhost:3000/ko/docs/components/questionnaire
```

Check every preview in light and dark mode at desktop width and at a narrow
mobile viewport:

```text
demo, multiple, freeform, skip, shortcuts, validation, controlled, resume,
conditional, navigation-state, progress, animated, card, dialog
```

For each preview confirm there is no horizontal overflow, clipped focus ring,
overlapping action, or missing checked/invalid/disabled styling. Exercise these
specific interactions:

```text
ArrowUp/ArrowDown moves between answers.
Letter and number shortcuts choose the displayed answer.
Next validates required items and focuses the invalid answer control.
Previous restores the prior answer.
Skip advances an optional item and exposes skipped status.
Multiple selection serializes more than one value.
Freeform input serializes only when filled/selected.
Conditional answers enable and disable the dependent item.
Resume restores saved defaults after reset.
Card keeps header/content/footer spacing.
Dialog opens, advances, cancels, submits, and retains an accessible title.
```

Also open `/components` and `/ko/components`; confirm the Questionnaire gallery
card appears and links to the localized docs page.

- [ ] **Step 4: Delete the temporary contract after all tests and QA finish**

Use `apply_patch`:

```diff
*** Begin Patch
*** Delete File: components/ui/questionnaire.contract.test.tsx
*** End Patch
```

Verify no component-specific test remains:

```bash
rg --files components | rg 'questionnaire.*test' || true
```

Expected: no output.

- [ ] **Step 5: Re-run the permanent suite after cleanup**

```bash
bun test
python3 .claude/skills/add-component/scripts/check-registration.py questionnaire
git diff --check
git status --short
```

Expected: tests and checker PASS; no whitespace errors; status shows only the
deleted temporary test before committing.

- [ ] **Step 6: Commit test cleanup**

```bash
git add components/ui/questionnaire.contract.test.tsx
git commit -m "chore(questionnaire): Remove temporary contract test"
git status --short
```

Expected: the commit deletes the temporary test and final status is clean.
