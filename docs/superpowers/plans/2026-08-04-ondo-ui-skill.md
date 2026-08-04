# Ondo UI Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a self-contained Ondo UI AI skill from the GitHub repository, document it in English and Korean, and make `ondo-ui docs` resolve Ondo component and Composition documentation.

**Architecture:** Keep registry installation, project inspection, and MCP operations delegated to `shadcn@latest`. Add one focused `ondo-docs.mjs` module for Ondo documentation links, then package repository-hosted skill files separately from the npm CLI. Validate the static skill contract with Bun tests and preserve the existing Changesets/npm release path only for the CLI behavior correction.

**Tech Stack:** Node ESM CLI, Bun tests, shadcn CLI, shadcn registry JSON, Agent Skills `SKILL.md`, Fumadocs MDX, Changesets, GitHub Pages.

## Global Constraints

- Work on `feat/ondo-ui-skill`, based on commit `297084c` or a later `origin/main` containing PR #15.
- Follow `docs/superpowers/specs/2026-08-04-ondo-ui-skill-design.md` as the source of truth.
- The skill is installed from GitHub with `npx skills add douinc/ondo-ui`; it is not included in the npm tarball.
- Ondo is Base UI only. Do not add Radix or React Aria usage branches.
- Use `bunx --bun @dou.so/ondo-ui@latest` in Ondo skill examples.
- Keep `info`, registry resolution, installation, MCP, and non-Ondo docs behavior delegated to shadcn.
- Every Ondo-owned registry dependency must remain namespaced as `@ondo-ui/<name>`.
- English and Korean public documentation must ship together.
- Add a patch Changeset only because `ondo-ui docs` changes npm CLI behavior; do not manually edit the package version.
- Preserve unrelated user changes and do not touch `/Users/initred/Code/ui`.

---

## File Map

### Create

- `packages/ondo-ui-cli/bin/ondo-docs.mjs` — Ondo docs argument classification, registry lookup, link generation, and output.
- `scripts/ondo-docs.test.ts` — focused CLI docs resolver tests.
- `scripts/ondo-skill.test.ts` — repository-hosted skill contract tests.
- `skills/ondo-ui/SKILL.md` — main AI skill and project-aware workflow.
- `skills/ondo-ui/cli.md` — Ondo CLI reference.
- `skills/ondo-ui/customization.md` — Ondo tokens, fonts, and theming rules.
- `skills/ondo-ui/mcp.md` — shadcn MCP usage with `@ondo-ui`.
- `skills/ondo-ui/registry.md` — Ondo registry authoring and dependency rules.
- `skills/ondo-ui/rules/base-ui.md` — Base UI-only API rules.
- `skills/ondo-ui/rules/chat.md` — MessageScroller/Message/Bubble/Attachment/Marker composition.
- `skills/ondo-ui/rules/composition.md` — general components and Compositions.
- `skills/ondo-ui/rules/forms.md` — Field and form-control composition.
- `skills/ondo-ui/rules/icons.md` — configured icon library and `data-icon` rules.
- `skills/ondo-ui/rules/styling.md` — semantic colors and Tailwind conventions.
- `skills/ondo-ui/agents/openai.yml` — display metadata.
- `skills/ondo-ui/assets/ondo-small.png` — skill metadata icon copied from an existing Ondo PNG.
- `skills/ondo-ui/assets/ondo.png` — larger skill metadata icon copied from an existing Ondo PNG.
- `skills/ondo-ui/evals/evals.json` — five Ondo-specific evaluation scenarios.
- `content/docs/skills.mdx` — English Skills page.
- `content/docs/skills.ko.mdx` — Korean Skills page.
- `.changeset/ondo-ui-docs-links.md` — patch release note for the CLI correction.

### Modify

- `packages/ondo-ui-cli/bin/ondo-ui.mjs` — route `docs` through the Ondo resolver.
- `packages/ondo-ui-cli/package.json` — include `bin/ondo-docs.mjs`, but not `skills/`.
- `.github/workflows/release.yml` — include `bin/ondo-docs.mjs` in the exact npm pack allowlist.
- `scripts/ondo-cli.test.ts` — dispatcher regression coverage.
- `content/docs/meta.json` and `content/docs/meta.ko.json` — register Skills.
- `content/docs/index.mdx` and `content/docs/index.ko.mdx` — link Skills.
- `content/docs/mcp.mdx` and `content/docs/mcp.ko.mdx` — use namespaced dependency language and link Skills.
- `README.md` and `README_KO.md` — advertise skill installation.
- `packages/ondo-ui-cli/README.md` and `packages/ondo-ui-cli/README_KO.md` — document the GitHub skill and corrected docs command.

---

### Task 1: Build the Ondo docs resolver with TDD

**Files:**

- Create: `packages/ondo-ui-cli/bin/ondo-docs.mjs`
- Create: `scripts/ondo-docs.test.ts`

**Interfaces:**

- Consumes: `ONDO_REGISTRY_INDEX_URL` from `registry-menu.mjs`; registry items shaped like the published `registry.json` index.
- Produces: `classifyDocsAddress(address)`, `classifyOndoDocsItem(item)`, `buildOndoDocsResult(item)`, `parseOndoDocsArgs(args)`, and `runOndoDocs(args, dependencies)`.
- `runOndoDocs` returns a numeric exit status, never calls `process.exit`, and accepts injected `fetchRegistry`, `runShadcn`, `log`, and `warn` functions.

- [ ] **Step 1: Write failing address and category tests**

Create `scripts/ondo-docs.test.ts` using `bun:test` and import the not-yet-created helpers:

```ts
import { describe, expect, test } from "bun:test"

import {
  buildOndoDocsResult,
  classifyDocsAddress,
  classifyOndoDocsItem,
  parseOndoDocsArgs,
  runOndoDocs,
} from "../packages/ondo-ui-cli/bin/ondo-docs.mjs"

const registry = {
  items: [
    { name: "button", type: "registry:ui" },
    {
      name: "empty-view",
      type: "registry:component",
      files: [{ path: "components/compositions/empty-view.tsx" }],
    },
    { name: "theme", type: "registry:theme" },
    { name: "utils", type: "registry:lib" },
  ],
}

describe("Ondo docs resolver", () => {
  test("classifies Ondo and external addresses", () => {
    expect(classifyDocsAddress("button")).toEqual({
      kind: "ondo",
      name: "button",
    })
    expect(classifyDocsAddress("@ondo-ui/button")).toEqual({
      kind: "ondo",
      name: "button",
    })
    expect(classifyDocsAddress("@acme/button")).toEqual({
      kind: "external",
      address: "@acme/button",
    })
    expect(classifyDocsAddress("owner/repo/button")).toEqual({
      kind: "external",
      address: "owner/repo/button",
    })
  })

  test("maps registry items to Ondo documentation categories", () => {
    expect(classifyOndoDocsItem(registry.items[0])).toBe("component")
    expect(classifyOndoDocsItem(registry.items[1])).toBe("composition")
    expect(classifyOndoDocsItem(registry.items[2])).toBe("theming")
    expect(classifyOndoDocsItem(registry.items[3])).toBe("registry")
  })
})
```

- [ ] **Step 2: Run the test and verify the expected RED state**

Run:

```bash
bun test scripts/ondo-docs.test.ts
```

Expected: FAIL because `packages/ondo-ui-cli/bin/ondo-docs.mjs` does not exist.

- [ ] **Step 3: Implement address classification and deterministic links**

Create `ondo-docs.mjs` with these constants and behaviors:

```js
import { ONDO_REGISTRY_INDEX_URL } from "./registry-menu.mjs"

export const ONDO_DOCS_BASE_URL = "https://ui.ondo.dou.so/docs"
export const ONDO_REGISTRY_ITEM_BASE_URL = "https://ui.ondo.dou.so/r"

export function classifyDocsAddress(address) {
  if (address.startsWith("@ondo-ui/")) {
    return { kind: "ondo", name: address.slice("@ondo-ui/".length) }
  }

  if (
    address.startsWith("@") ||
    address.startsWith("http://") ||
    address.startsWith("https://") ||
    address.startsWith("./") ||
    address.startsWith("../") ||
    address.includes("/") ||
    address.endsWith(".json")
  ) {
    return { kind: "external", address }
  }

  return { kind: "ondo", name: address }
}
```

`classifyOndoDocsItem` returns:

- `"component"` for `registry:ui`;
- `"composition"` when any normalized file path starts with `components/compositions/`;
- `"theming"` for `theme` and `theme-provider`;
- `"registry"` for an installable item without a dedicated website page.

`buildOndoDocsResult` returns this stable shape:

```js
{
  component: item.name,
  category,
  links: {
    ...(docsUrl ? { docs: docsUrl } : {}),
    registry: `${ONDO_REGISTRY_ITEM_BASE_URL}/${item.name}.json`,
  },
}
```

- [ ] **Step 4: Add failing parser and execution tests**

Extend `scripts/ondo-docs.test.ts`:

```ts
test("parses item names and JSON output", () => {
  expect(parseOndoDocsArgs(["button", "empty-view", "--json"])).toEqual({
    items: ["button", "empty-view"],
    json: true,
    forwardedArgs: ["button", "empty-view", "--json"],
  })
})

test("prints deterministic JSON for Ondo items", async () => {
  const output: string[] = []
  const status = await runOndoDocs(["button", "empty-view", "--json"], {
    fetchRegistry: async () => registry,
    log: (value: string) => output.push(value),
  })

  expect(status).toBe(0)
  expect(JSON.parse(output.join("\n"))).toEqual({
    registry: "@ondo-ui",
    base: "base",
    results: [
      buildOndoDocsResult(registry.items[0]),
      buildOndoDocsResult(registry.items[1]),
    ],
  })
})

test("delegates external addresses and rejects mixed sources", async () => {
  const calls: unknown[] = []
  expect(
    await runOndoDocs(["@acme/button"], {
      runShadcn: (command: string, args: string[]) => {
        calls.push({ command, args })
        return 0
      },
    })
  ).toBe(0)
  expect(calls).toEqual([
    { command: "docs", args: ["@acme/button"] },
  ])

  await expect(
    runOndoDocs(["button", "@acme/card"], {})
  ).rejects.toThrow("Run Ondo and external documentation requests separately")
})
```

Also test unknown Ondo items and a `registry`-only item that omits `links.docs`.

- [ ] **Step 5: Implement parsing, fetch validation, output, and errors**

Implementation requirements:

- `parseOndoDocsArgs` requires at least one positional item.
- Recognize `--json`; preserve all original arguments for external delegation.
- Treat `-c/--cwd` and `-b/--base` plus their following values as flags, not item names.
- Fetch `ONDO_REGISTRY_INDEX_URL` only for Ondo items.
- Validate that the fetched value has an `items` array.
- Preserve requested item order.
- Throw `Ondo registry item "<name>" was not found.` for unknown items.
- Text output prints the item name and aligned `docs`/`registry` links; warn when no docs page exists.
- JSON output emits one `JSON.stringify(payload, null, 2)` call and no warnings.
- External-only input calls `runShadcn("docs", originalArgs)` without fetching Ondo.

- [ ] **Step 6: Run focused tests and commit**

Run:

```bash
bun test scripts/ondo-docs.test.ts
```

Expected: all Ondo docs resolver tests PASS.

Commit:

```bash
git add packages/ondo-ui-cli/bin/ondo-docs.mjs scripts/ondo-docs.test.ts
git commit -m "fix: resolve ondo documentation links"
```

---

### Task 2: Route the public `docs` command through the Ondo resolver

**Files:**

- Modify: `packages/ondo-ui-cli/bin/ondo-ui.mjs`
- Modify: `scripts/ondo-cli.test.ts`

**Interfaces:**

- Consumes: `runOndoDocs(args, dependencies)` from Task 1.
- Produces: public `ondo-ui docs` behavior while preserving shadcn delegation for external-only addresses.

- [ ] **Step 1: Add a failing dispatcher test**

Import no new production internals in the test. Exercise `run` with an injected docs boundary:

```ts
test("routes docs through the Ondo docs resolver", async () => {
  const calls: unknown[] = []
  const status = await run(["docs", "button", "--json"], {
    runDocs: async (args: string[]) => {
      calls.push(args)
      return 0
    },
  })

  expect(status).toBe(0)
  expect(calls).toEqual([["button", "--json"]])
})
```

- [ ] **Step 2: Verify RED**

Run:

```bash
bun test scripts/ondo-cli.test.ts
```

Expected: FAIL because `docs` is still handled by the generic public-command delegation branch.

- [ ] **Step 3: Add the focused dispatch branch**

At the top of `ondo-ui.mjs`, import `runOndoDocs`. In `run`, add this branch after `add` and before generic public-command handling:

```js
if (command === "docs") {
  return (dependencies.runDocs ?? runOndoDocs)(args, {
    runShadcn: delegate,
  })
}
```

Do not remove `"docs"` from `PUBLIC_COMMANDS`; it remains part of help output.

- [ ] **Step 4: Run CLI regressions and manual JSON checks**

Run:

```bash
bun test scripts/ondo-cli.test.ts scripts/ondo-docs.test.ts
bun packages/ondo-ui-cli/bin/ondo-ui.mjs docs button --json
bun packages/ondo-ui-cli/bin/ondo-ui.mjs docs empty-view --json
```

Expected:

- tests PASS;
- button docs URL ends in `/docs/components/button`;
- empty-view docs URL ends in `/docs/compositions/empty-view`;
- both include `/r/<name>.json` registry URLs.

- [ ] **Step 5: Commit**

```bash
git add packages/ondo-ui-cli/bin/ondo-ui.mjs scripts/ondo-cli.test.ts
git commit -m "fix: route ondo docs through registry metadata"
```

---

### Task 3: Establish the main repository-hosted skill contract with TDD

**Files:**

- Create: `scripts/ondo-skill.test.ts`
- Create initially: `skills/ondo-ui/SKILL.md`

**Interfaces:**

- Consumes: repository paths, `packages/ondo-ui-cli/package.json`, and docs metadata.
- Produces: the main skill contract and a reusable test that later tasks extend for references, rules, evaluations, and public docs.

- [ ] **Step 1: Write the failing main-file contract**

Create `scripts/ondo-skill.test.ts` with a `skillRoot` resolved from
`import.meta.url` and this initial required list:

```ts
const requiredFiles = [
  "SKILL.md",
]
```

Use `access()` to assert every path exists. Add tests that parse the root
`package.json` files list and assert no entry begins with `skills`.

- [ ] **Step 2: Verify RED**

Run:

```bash
bun test scripts/ondo-skill.test.ts
```

Expected: FAIL listing the missing `skills/ondo-ui/SKILL.md`.

- [ ] **Step 3: Create the main Skill frontmatter and workflow**

Create `skills/ondo-ui/SKILL.md` with the approved frontmatter:

```yaml
---
name: ondo-ui
description: Manages Ondo UI projects and registry items — initializing supported frameworks, adding and searching components and Compositions, composing Base UI interfaces, applying Ondo styling rules, and configuring MCP access.
user-invocable: false
allowed-tools: Bash(bunx --bun @dou.so/ondo-ui@latest *)
---
```

Immediately below the introduction, inject:

````markdown
## Current Project Context

```json
!`bunx --bun @dou.so/ondo-ui@latest info --json`
```
````

Include the eight-step workflow from the design and the
`add --dry-run`/`--diff` update process. Tasks 4 and 5 add relative links as
their reference and rule files are created. Do not include Radix or React Aria
alternatives.

- [ ] **Step 4: Extend the contract tests for content and links**

Add these assertions:

```ts
expect(skill).toContain("name: ondo-ui")
expect(skill).toContain("@dou.so/ondo-ui@latest info --json")
expect(skill).toContain(
  "allowed-tools: Bash(bunx --bun @dou.so/ondo-ui@latest *)"
)
expect(skill).not.toMatch(/Correct \(radix\)|Correct \(aria\)/i)
```

Do not add the relative-link resolver until Task 4 introduces reference files.

- [ ] **Step 5: Run the test and commit the contract baseline**

Run:

```bash
bun test scripts/ondo-skill.test.ts
```

Expected: all main skill contract tests PASS.

Commit the test and main skill:

```bash
git add scripts/ondo-skill.test.ts skills/ondo-ui/SKILL.md
git commit -m "feat: define ondo ui skill contract"
```

---

### Task 4: Add Ondo CLI, registry, customization, and MCP references

**Files:**

- Create: `skills/ondo-ui/cli.md`
- Create: `skills/ondo-ui/customization.md`
- Create: `skills/ondo-ui/mcp.md`
- Create: `skills/ondo-ui/registry.md`
- Modify: `skills/ondo-ui/SKILL.md`

**Interfaces:**

- Consumes: current CLI behavior, registry schema, theme tokens, and MCP setup.
- Produces: complete references linked by the main skill.

- [ ] **Step 1: Write `cli.md` from the actual Ondo command surface**

Include exact command sections for:

```bash
bunx --bun @dou.so/ondo-ui@latest init -t astro
bunx --bun @dou.so/ondo-ui@latest add
bunx --bun @dou.so/ondo-ui@latest add button empty-view
bunx --bun @dou.so/ondo-ui@latest add --all
bunx --bun @dou.so/ondo-ui@latest add button --dry-run
bunx --bun @dou.so/ondo-ui@latest search @ondo-ui --query button
bunx --bun @dou.so/ondo-ui@latest view @ondo-ui/button
bunx --bun @dou.so/ondo-ui@latest docs button --json
bunx --bun @dou.so/ondo-ui@latest info --json
```

Separate Ondo-owned `init`, `add`, and `docs` behavior from delegated commands.
Document supported frameworks, system-item exclusion, `--cwd`, smart update
workflow, and external-registry delegation. State that `apply` and `preset`
are shadcn behavior and do not define an Ondo preset format.

- [ ] **Step 2: Write `registry.md` with the namespace invariant**

Include source vs built registry forms, relevant item types, file targets,
dependencies, and this required example:

```json
{
  "name": "number-badge",
  "type": "registry:component",
  "registryDependencies": [
    "@ondo-ui/utils",
    "@ondo-ui/badge",
    "@ondo-ui/number-count"
  ]
}
```

Explicitly state that bare dependency names resolve to official shadcn items.
Reference `.claude/skills/add-component/SKILL.md` and both checker/build
commands for maintainers.

- [ ] **Step 3: Write `customization.md` from the shipped theme**

Document:

- standard background, foreground, card, primary, secondary, muted, accent,
  destructive, border, input, ring, chart, and sidebar tokens;
- Ondo `info`, `success`, `warning`, `surface`, code, and selection tokens;
- Pretendard and Monaspace Neon roles;
- `@theme inline` and Tailwind v4;
- class-based dark mode;
- customization order: existing variant, `className`, new `cva` variant,
  wrapper/Composition;
- use the `tailwindCssFile` reported by `info --json`.

- [ ] **Step 4: Write `mcp.md` for the existing shadcn server**

Include the `@ondo-ui` `components.json` mapping, client setup commands, manual
Codex TOML, and MCP tool purposes. Example prompts must explicitly mention
`@ondo-ui`. State that project configuration comes from `info --json`, not an
MCP tool.

- [ ] **Step 5: Extend the contract for reference files and relative links**

Add `cli.md`, `customization.md`, `mcp.md`, and `registry.md` to the
`requiredFiles` array. Update `SKILL.md` to link to each with a `./` relative
link.

Extract Markdown links beginning with `./`, remove `#anchor` fragments, and
assert every referenced path exists beneath `skillRoot`. Resolve each path and
assert it still starts with `skillRoot` before calling `access()`.

- [ ] **Step 6: Run link validation and commit**

Run:

```bash
bun test scripts/ondo-skill.test.ts
```

Expected: all required reference files and relative links PASS. Rule,
metadata, asset, and evaluation paths are added to the contract only in Task
5 when those files are created.

Commit:

```bash
git add skills/ondo-ui/SKILL.md skills/ondo-ui/cli.md skills/ondo-ui/customization.md skills/ondo-ui/mcp.md skills/ondo-ui/registry.md
git commit -m "docs: add ondo skill references"
```

---

### Task 5: Add Base UI rules, metadata, assets, and evaluations

**Files:**

- Create: `skills/ondo-ui/rules/base-ui.md`
- Create: `skills/ondo-ui/rules/chat.md`
- Create: `skills/ondo-ui/rules/composition.md`
- Create: `skills/ondo-ui/rules/forms.md`
- Create: `skills/ondo-ui/rules/icons.md`
- Create: `skills/ondo-ui/rules/styling.md`
- Create: `skills/ondo-ui/agents/openai.yml`
- Create: `skills/ondo-ui/assets/ondo-small.png`
- Create: `skills/ondo-ui/assets/ondo.png`
- Create: `skills/ondo-ui/evals/evals.json`
- Modify: `scripts/ondo-skill.test.ts`

**Interfaces:**

- Consumes: existing Ondo component APIs and application icons.
- Produces: enforceable rule references, agent presentation metadata, and five evaluation scenarios.

- [ ] **Step 1: Write rule files from Ondo source and docs examples**

Each rule must include Incorrect/Correct examples and reference actual Ondo
exports. Required coverage:

- `base-ui.md`: `render`, `nativeButton={false}`, Select items, ToggleGroup
  arrays, Slider scalar values, accessible overlay titles.
- `forms.md`: `FieldGroup`, `Field`, `FieldSet`, `FieldLegend`,
  `InputGroupInput`, `InputGroupTextarea`, `data-invalid`, `aria-invalid`.
- `composition.md`: Groups around items, full Card composition, Alert, Empty,
  EmptyView, NumberBadge, Separator, Skeleton, Badge, AvatarFallback, overlay
  titles, TabsList.
- `styling.md`: semantic Ondo tokens, `gap-*`, `size-*`, `truncate`, `cn()`,
  no manual overlay z-index, and restrained `dark:` use.
- `icons.md`: use `config.iconLibrary`, `data-icon`, component-owned icon
  sizing, and component objects instead of string icon keys.
- `chat.md`: fixed MessageScroller nesting and Message/Bubble/Attachment/Marker
  composition; no custom stick-to-bottom implementation.

- [ ] **Step 2: Add a rule regression assertion**

Read all files under `skills/ondo-ui/rules` and assert:

```ts
expect(ruleText).not.toMatch(/Correct \(radix\)|Correct \(aria\)/i)
expect(ruleText).not.toMatch(/<\w+[^>]*\basChild(?:=|\s|>)/)
expect(ruleText).toContain("render")
```

The prose may say “use `render` instead of Radix `asChild`”; the test prevents
prescriptive `asChild` JSX rather than banning the explanatory word.

- [ ] **Step 3: Add agent metadata and self-contained icons**

Create:

```yaml
interface:
  display_name: "Ondo UI"
  short_description: "Builds and manages Base UI interfaces with the Ondo registry, CLI, components, Compositions, and design rules."
  icon_small: "./assets/ondo-small.png"
  icon_large: "./assets/ondo.png"
```

Copy `app/icon1.png` to `skills/ondo-ui/assets/ondo-small.png` and
`app/apple-icon.png` to `skills/ondo-ui/assets/ondo.png`. Inspect both source
images before copying; if either is not an Ondo brand mark, use the matching
PNG produced from `public/svg/ondo-profile-light.svg` instead and record the
choice in the commit message.

- [ ] **Step 4: Add five evaluation scenarios**

Create valid JSON with `skill_name: "ondo-ui"` and unique IDs. Each scenario
contains `prompt`, `expected_output`, `files: []`, and concrete expectations.
Cover exactly these themes:

1. Field-based profile form and semantic validation.
2. Base UI Dialog with `render`, title, AvatarFallback, and configured icons.
3. Dashboard Cards with Skeleton, NumberCount/NumberBadge, and semantic state
   colors.
4. Empty state using EmptyView and lower-level escape guidance.
5. Streaming chat using MessageScroller, Message, Bubble, Attachment, Marker,
   and no manual scroll observer.

- [ ] **Step 5: Extend eval validation and reach GREEN**

Extend `requiredFiles` with `agents/openai.yml`, both assets,
`evals/evals.json`, and all six `rules/*.md` files. Update `SKILL.md` to link
to each rule file. Then parse the evaluation file and assert:

```ts
expect(evals.skill_name).toBe("ondo-ui")
expect(evals.evals).toHaveLength(5)
expect(new Set(evals.evals.map((item) => item.id)).size).toBe(5)
for (const item of evals.evals) {
  expect(item.prompt.length).toBeGreaterThan(20)
  expect(item.expectations.length).toBeGreaterThanOrEqual(4)
}
```

Run:

```bash
bun test scripts/ondo-skill.test.ts
```

Expected: all skill contract tests PASS.

- [ ] **Step 6: Commit**

```bash
git add skills/ondo-ui/rules skills/ondo-ui/agents skills/ondo-ui/assets skills/ondo-ui/evals scripts/ondo-skill.test.ts
git commit -m "feat: add ondo skill rules and evaluations"
```

---

### Task 6: Add bilingual Skills documentation and navigation

**Files:**

- Create: `content/docs/skills.mdx`
- Create: `content/docs/skills.ko.mdx`
- Modify: `content/docs/meta.json`
- Modify: `content/docs/meta.ko.json`
- Modify: `content/docs/index.mdx`
- Modify: `content/docs/index.ko.mdx`
- Modify: `content/docs/mcp.mdx`
- Modify: `content/docs/mcp.ko.mdx`
- Modify: `scripts/ondo-skill.test.ts`

**Interfaces:**

- Consumes: published GitHub skill path and existing Fumadocs conventions.
- Produces: visible `/docs/skills` and `/ko/docs/skills` pages.

- [ ] **Step 1: Add failing documentation registration tests**

Extend `scripts/ondo-skill.test.ts` to parse both meta files and assert
`pages` contains `skills`. Read both MDX files and assert they contain:

```text
npx skills add douinc/ondo-ui
```

Run the test and verify failure because the pages do not yet exist.

- [ ] **Step 2: Create English and Korean pages with matching structure**

Use this English frontmatter:

```mdx
---
title: Skills
description: Give your AI assistant project-aware knowledge of Ondo UI components, Compositions, Base UI patterns, and registry workflows.
---
```

Use this Korean frontmatter:

```mdx
---
title: Skills
description: AI 어시스턴트에 Ondo UI 컴포넌트, Compositions, Base UI 패턴과 레지스트리 작업 흐름을 제공합니다.
---
```

Both pages must contain these sections in the same order:

1. Introduction and example prompts.
2. Install with `npx skills add douinc/ondo-ui`.
3. What's included: project context, CLI, Components/Compositions, Base UI,
   theming, registry, MCP.
4. How it works: detection, `info --json`, pattern enforcement, discovery,
   review.
5. Learn more links to Installation, CLI, Theming, MCP, Components, and
   Compositions.

- [ ] **Step 3: Register navigation and update introductions**

Insert `"skills"` immediately after `"cli"` in both meta files. Add a Skills
link to both docs introduction pages without removing Installation or CLI
links.

- [ ] **Step 4: Correct MCP dependency language**

Update the final MCP explanation so the example says
`@ondo-ui/alert-dialog` pulls `@ondo-ui/button` and `@ondo-ui/utils`. Add a
link to Skills as the instruction layer that complements MCP registry access.

- [ ] **Step 5: Regenerate MDX and verify focused tests**

Run:

```bash
bun run postinstall
bun test scripts/ondo-skill.test.ts
```

Expected: generated Fumadocs sources complete and skill contract tests PASS.

- [ ] **Step 6: Commit**

```bash
git add content/docs/skills.mdx content/docs/skills.ko.mdx content/docs/meta.json content/docs/meta.ko.json content/docs/index.mdx content/docs/index.ko.mdx content/docs/mcp.mdx content/docs/mcp.ko.mdx scripts/ondo-skill.test.ts
git commit -m "docs: add ondo ui skills guide"
```

---

### Task 7: Update READMEs and npm package/release contracts

**Files:**

- Modify: `README.md`
- Modify: `README_KO.md`
- Modify: `packages/ondo-ui-cli/README.md`
- Modify: `packages/ondo-ui-cli/README_KO.md`
- Modify: `packages/ondo-ui-cli/package.json`
- Modify: `.github/workflows/release.yml`
- Create: `.changeset/ondo-ui-docs-links.md`
- Modify: `scripts/ondo-skill.test.ts`

**Interfaces:**

- Consumes: new CLI module and GitHub-hosted skill.
- Produces: complete npm tarball for the CLI correction while proving the skill remains outside it.

- [ ] **Step 1: Add the new runtime module to the package allowlists**

Add `bin/ondo-docs.mjs` to `packages/ondo-ui-cli/package.json` `files` next to
the other bin helpers. Add the same path to the `expected` array in
`.github/workflows/release.yml`.

Do not add `skills`, `skills/ondo-ui`, or repository docs to either list.

- [ ] **Step 2: Document Skills and corrected docs behavior in four READMEs**

Add a concise “Ondo UI Skill” section containing:

```bash
npx skills add douinc/ondo-ui
```

Explain that it is installed from GitHub and gives AI assistants Ondo project
context and composition rules. Link to `https://ui.ondo.dou.so/docs/skills`.

Update the CLI command examples to include:

```bash
bunx --bun @dou.so/ondo-ui@latest docs button
bunx --bun @dou.so/ondo-ui@latest docs empty-view --json
```

- [ ] **Step 3: Add the patch Changeset**

Create exactly:

```md
---
"@dou.so/ondo-ui": patch
---

Resolve Ondo component and Composition documentation links from the Ondo CLI.
```

Do not mention the GitHub-only skill as npm package contents.

- [ ] **Step 4: Strengthen the package exclusion test**

In `scripts/ondo-skill.test.ts`, assert package files contain
`bin/ondo-docs.mjs` and do not contain any path beginning with `skills`.

- [ ] **Step 5: Verify the npm tarball exactly**

From `packages/ondo-ui-cli`, run:

```bash
npm pack --dry-run --json
```

Expected files:

```text
README.md
README_KO.md
bin/ondo-docs.mjs
bin/ondo-ui.mjs
bin/registry-menu.mjs
bin/shadcn-process.mjs
package.json
```

No `skills/`, website, test, or design files may appear.

- [ ] **Step 6: Run release-related tests and commit**

Run:

```bash
bun test scripts/ondo-cli.test.ts scripts/ondo-docs.test.ts scripts/ondo-skill.test.ts
```

Expected: all focused tests PASS.

Commit:

```bash
git add README.md README_KO.md packages/ondo-ui-cli/README.md packages/ondo-ui-cli/README_KO.md packages/ondo-ui-cli/package.json .github/workflows/release.yml .changeset/ondo-ui-docs-links.md scripts/ondo-skill.test.ts
git commit -m "docs: publish ondo skill guidance"
```

---

### Task 8: Verify the complete feature and prepare the PR

**Files:** No planned source edits. If verification exposes a defect, return
to the task that owns the affected file and repeat its RED/GREEN cycle before
continuing.

- [ ] **Step 1: Run all automated checks with fresh output**

Run in order:

```bash
bun test
bun run typecheck
bun run lint
bun run build
```

Expected:

- all Bun tests pass;
- TypeScript exits 0;
- ESLint exits 0, with no new warnings;
- static export verifies every required path, including English and Korean
  Skills pages and all registry payloads.

- [ ] **Step 2: Re-run public CLI smoke checks**

Run:

```bash
bun packages/ondo-ui-cli/bin/ondo-ui.mjs info --json
bun packages/ondo-ui-cli/bin/ondo-ui.mjs docs button --json
bun packages/ondo-ui-cli/bin/ondo-ui.mjs docs empty-view --json
bun packages/ondo-ui-cli/bin/ondo-ui.mjs docs @shadcn/button
```

Expected:

- project context still includes `base: "base"`, `iconLibrary: "tabler"`, and
  the `@ondo-ui` registry;
- Ondo docs resolve to Ondo URLs;
- `@shadcn/button` remains delegated to the official docs command.

- [ ] **Step 3: Inspect and validate skill discovery**

Run:

```bash
npx --yes skills add douinc/ondo-ui --list
```

Before merge, this command may still show the default branch without the new
skill. In that case, record the expected post-merge check in the PR and rely
on `scripts/ondo-skill.test.ts` for the branch contract. After merge, rerun and
require `ondo-ui` in the discovered skill list.

- [ ] **Step 4: Verify diff scope and whitespace**

Run:

```bash
git diff origin/main...HEAD --check
git status --short
git log --oneline origin/main..HEAD
```

Expected: only the design/plan, skill bundle, docs resolver, tests, bilingual
docs/READMEs, package allowlists, and one patch Changeset are present.

- [ ] **Step 5: Request code review and create the PR**

Use the code-review skill before integration. Push `feat/ondo-ui-skill` and
open a PR with this structure:

```md
## Summary
- add a repository-hosted Ondo UI skill with Base UI, CLI, registry, theming, MCP, and composition guidance
- add bilingual Skills documentation and README installation guidance
- resolve Ondo component and Composition documentation links from the CLI

## Verification
- bun test
- bun run typecheck
- bun run lint
- bun run build
- npm pack --dry-run --json
```

Do not merge until `Build static export` and required review rules pass.

---

## Post-merge checks

After the feature PR reaches `main`:

1. Confirm GitHub Pages successfully deploys `/docs/skills` and
   `/ko/docs/skills`.
2. Run `npx skills add douinc/ondo-ui --list` and verify `ondo-ui` is listed.
3. Install into a disposable project with
   `npx skills add douinc/ondo-ui --skill ondo-ui --yes` and inspect the copied
   `SKILL.md`, references, rules, metadata, assets, and evals.
4. Confirm Changesets creates a Version Packages PR for the CLI patch.
5. Merge the Version Packages PR only after npm-release environment approval;
   confirm the new `@dou.so/ondo-ui` version contains `bin/ondo-docs.mjs` and
   still excludes `skills/`.
