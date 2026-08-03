# Ondo CLI Init Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an `ondo-ui init` executable that delegates to shadcn initialization, installs framework-compatible Ondo theme assets, and registers the Ondo namespace automatically.

**Architecture:** Keep shadcn as the project scaffold and installer. The thin Node CLI selects direct Ondo registry item URLs based on the requested framework, invokes `shadcn init`, then safely merges `@ondo-ui` into every generated `components.json`. The package publishes only the CLI artifact while the repository remains the documentation and registry source.

**Tech Stack:** Node.js ESM CLI, Bun tests, shadcn CLI, JSON configuration, MDX installation docs.

## Global Constraints

- The CLI requires Node.js 20 or newer, matching shadcn's current engine requirement.
- The registry namespace is exactly `@ondo-ui` and the URL is `https://ui.ondo.dou.so/r/{name}.json`.
- Frameworks are `next`, `vite`, `start`, `react-router`, `laravel`, and `astro`.
- Astro receives `theme` only because the current `theme-provider` is based on `next-themes`.
- Existing registry entries must be preserved.

---

### Task 1: Add failing unit tests for CLI behavior

**Files:**
- Create: `scripts/ondo-cli.test.ts`
- Test: `bin/ondo-ui.mjs` exports used by the tests

**Interfaces:**
- Tests consume `getFrameworkItems(framework)`, `buildShadcnArgs(args, framework)`, and `mergeOndoRegistry(config)` from `bin/ondo-ui.mjs`.
- Tests produce the behavior contract for framework selection, argument construction, and non-destructive config merging.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, test } from "bun:test"

import {
  buildShadcnArgs,
  getFrameworkItems,
  mergeOndoRegistry,
} from "../bin/ondo-ui.mjs"

describe("Ondo init CLI", () => {
  test("selects theme and provider for React frameworks", () => {
    expect(getFrameworkItems("next")).toEqual(["theme", "theme-provider"])
    expect(getFrameworkItems("vite")).toEqual(["theme", "theme-provider"])
    expect(getFrameworkItems("start")).toEqual(["theme", "theme-provider"])
    expect(getFrameworkItems("react-router")).toEqual([
      "theme",
      "theme-provider",
    ])
    expect(getFrameworkItems("laravel")).toEqual([
      "theme",
      "theme-provider",
    ])
  })

  test("selects only the theme for Astro", () => {
    expect(getFrameworkItems("astro")).toEqual(["theme"])
  })

  test("builds shadcn init args with direct registry URLs", () => {
    expect(buildShadcnArgs(["-t", "next"], "next")).toEqual([
      "init",
      "-t",
      "next",
      "--yes",
      "--no-monorepo",
      "https://ui.ondo.dou.so/r/theme.json",
      "https://ui.ondo.dou.so/r/theme-provider.json",
    ])
  })

  test("does not pass the Laravel template to shadcn", () => {
    expect(buildShadcnArgs(["-t", "laravel"], "laravel")).toEqual([
      "init",
      "--yes",
      "--no-monorepo",
      "https://ui.ondo.dou.so/r/theme.json",
      "https://ui.ondo.dou.so/r/theme-provider.json",
    ])
  })

  test("preserves existing registries while adding Ondo", () => {
    expect(
      mergeOndoRegistry({
        style: "base-nova",
        registries: { "@acme": "https://example.com/r/{name}.json" },
      })
    ).toEqual({
      style: "base-nova",
      registries: {
        "@acme": "https://example.com/r/{name}.json",
        "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json",
      },
    })
  })
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `bun test scripts/ondo-cli.test.ts`

Expected: FAIL because `bin/ondo-ui.mjs` and its exported helpers do not exist.

### Task 2: Implement the publishable CLI

**Files:**
- Create: `bin/ondo-ui.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes the framework and shadcn arguments from the command line.
- Produces a public `ondo-ui` executable with `init` behavior and exported pure helpers for tests.

- [ ] **Step 1: Implement framework mappings and pure helpers**

Add a framework map, direct registry URL builder, `getFrameworkItems`,
`buildShadcnArgs`, and `mergeOndoRegistry`. Reject unknown framework values with
an error listing the supported values.

- [ ] **Step 2: Implement shadcn delegation**

Run `npx --yes shadcn@latest` with the generated `init` arguments using
`spawnSync`/`spawn` with inherited stdio. Preserve the child exit status and
return a non-zero exit code when shadcn fails.

- [ ] **Step 3: Implement project config discovery and registry merge**

Resolve the project root from `--cwd` and `--name`, find generated
`components.json` files while skipping `node_modules` and `.git`, parse each
file, merge `@ondo-ui` without deleting other namespaces, and write formatted
JSON with a trailing newline. Fail clearly for missing or invalid config files.

- [ ] **Step 4: Add the npm bin entry and package allowlist**

Update `package.json` to remove `private`, add `publishConfig.access: public`,
add `bin.ondo-ui: ./bin/ondo-ui.mjs`, and publish only `bin` plus package
metadata through the `files` allowlist.

- [ ] **Step 5: Run focused tests**

Run: `bun test scripts/ondo-cli.test.ts`

Expected: PASS for framework selection, argument construction, and config merging.

### Task 3: Update installation documentation

**Files:**
- Modify: `content/docs/installation/index.mdx`
- Modify: `content/docs/installation/index.ko.mdx`
- Modify: `content/docs/installation/next.mdx`
- Modify: `content/docs/installation/next.ko.mdx`
- Modify: `content/docs/installation/vite.mdx`
- Modify: `content/docs/installation/vite.ko.mdx`
- Modify: `content/docs/installation/tanstack.mdx`
- Modify: `content/docs/installation/tanstack.ko.mdx`
- Modify: `content/docs/installation/react-router.mdx`
- Modify: `content/docs/installation/react-router.ko.mdx`
- Modify: `content/docs/installation/astro.mdx`
- Modify: `content/docs/installation/astro.ko.mdx`
- Modify: `content/docs/installation/laravel.mdx`
- Modify: `content/docs/installation/laravel.ko.mdx`

**Interfaces:**
- Documentation consumes the published `ondo-ui` CLI.
- Users receive one framework-specific command that performs initialization,
  theme installation, and registry configuration.

- [ ] **Step 1: Replace new-project CLI examples**

Use `npx ondo-ui@latest init -t next`, `-t vite`, `-t start`,
`-t react-router`, and `-t astro`. For Laravel, document creating the Laravel
app first and then running `npx ondo-ui@latest init -t laravel` from that app.

- [ ] **Step 2: Remove redundant manual registry and theme setup from those paths**

Explain that the wrapper writes `@ondo-ui` and installs the framework's initial
Ondo theme assets. Keep the normal `shadcn add @ondo-ui/button` example for
subsequent components. Keep manual registration instructions only under the
existing-project/manual path.

- [ ] **Step 3: Run content checks**

Run: `rg -n "shadcn@latest init -t|Register the Ondo Registry|레지스트리 등록" content/docs/installation`

Expected: supported framework new-project paths use `ondo-ui`; manual setup
still contains the explicit registry instructions.

### Task 4: Verify package and framework integration

**Files:**
- Test: `scripts/ondo-cli.test.ts`
- Verify: `package.json`, generated CLI package, and temporary framework projects

**Interfaces:**
- Consumes the CLI and published package metadata from Tasks 1–3.
- Produces evidence that the command works for representative framework types.

- [ ] **Step 1: Verify the package artifact**

Run: `npm pack --dry-run --json`

Expected: the package is not private, exposes `ondo-ui`, and includes the CLI
file without the full Next application source.

- [ ] **Step 2: Run real Next and Astro temporary-project checks**

Run the CLI from the repository with temporary `--cwd` roots and verify:

```bash
components.json.registries["@ondo-ui"]
app/globals.css or src/styles/global.css
components/theme-provider.tsx is present for Next
components/theme-provider.tsx is absent for Astro
@fontsource/pretendard is in package.json
```

Move temporary roots to Trash after each check.

- [ ] **Step 3: Run the full repository verification**

Run: `bun test && bun run typecheck && bun run lint && bun run build`

Expected: all commands exit 0.

- [ ] **Step 4: Review the final diff**

Run: `git diff --check && git status --short`

Confirm only the CLI, package metadata, design/plan docs, tests, and intended
installation documentation changed.
