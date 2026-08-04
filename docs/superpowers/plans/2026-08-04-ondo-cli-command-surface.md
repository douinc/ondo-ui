# Ondo CLI Command Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose the project-facing shadcn CLI commands through
`@dou.so/ondo-ui`, with an Ondo-specific Components/Compositions menu and
registry-aware argument forwarding.

**Architecture:** Keep `init` as the existing Ondo-specific flow. Add pure
registry-menu helpers and one platform-safe shadcn process adapter. Delegate
actual registry resolution and file updates to `shadcn@latest`.

**Tech Stack:** Node ESM CLI, Bun tests, `prompts@^2.4.2`, `shadcn@latest`,
Ondo registry `https://ui.ondo.dou.so/r/registry.json`, Changesets.

## Global Constraints

- Preserve existing framework-aware `init` and package-manager symlink behavior.
- Menu categories are `registry:ui` Components and files under
  `components/compositions/` Compositions.
- `theme`, `theme-provider`, `utils`, and `use-mobile` are explicit-only.
- `build` and `registry` are thin registry-authoring passthroughs.
- Do not copy shadcn's registry resolver or file updater.
- Next release after `1.3.1` is a Changesets minor release (`1.4.0`).
- Work on `feat/ondo-cli-add`, not protected `main`.

## File Map

- Modify `packages/ondo-ui-cli/bin/ondo-ui.mjs`: command parsing and dispatch.
- Create `packages/ondo-ui-cli/bin/registry-menu.mjs`: registry fetch,
  classification, menu choices, and item normalization.
- Create `packages/ondo-ui-cli/bin/shadcn-process.mjs`: shadcn process adapter.
- Modify `packages/ondo-ui-cli/package.json` and `bun.lock`: add `prompts`.
- Modify `scripts/ondo-cli.test.ts`: pure helper, dispatch, and regression tests.
- Modify both CLI READMEs and both installation index pages.
- Create `.changeset/ondo-cli-command-surface.md`.

## Task 1: Registry menu helpers (TDD)

**Files:** Create `packages/ondo-ui-cli/bin/registry-menu.mjs`; modify
`scripts/ondo-cli.test.ts`.

**Interfaces:**

- `classifyRegistryItem(item)` returns `"component" | "composition" | null`.
- `getSelectableRegistryItems(registry)` returns
  `{ components: RegistryItem[], compositions: RegistryItem[] }`.
- `normalizeOndoItemAddress(item)` preserves URLs, local paths, and `@` names,
  otherwise returns `@ondo-ui/<item>`.
- `buildRegistryChoices(registry)` returns prompt-compatible choices with
  disabled Components and Compositions headings.

- [ ] Write failing tests for `registry:ui`, a composition file path, and
  `theme-provider` (must be excluded):

```ts
expect(classifyRegistryItem({ name: "button", type: "registry:ui" })).toBe("component")
expect(classifyRegistryItem({
  name: "empty-view",
  type: "registry:component",
  files: [{ path: "components/compositions/empty-view.tsx" }],
})).toBe("composition")
expect(classifyRegistryItem({
  name: "theme-provider",
  type: "registry:component",
  files: [{ path: "components/theme-provider.tsx" }],
})).toBeNull()
```

- [ ] Run `bun test scripts/ondo-cli.test.ts`; expected failure is missing
  registry-menu exports.
- [ ] Implement the pure helpers, preserving registry order and excluding
  malformed/internal items from selectable groups.
- [ ] Run the focused test again; all new and existing tests must pass.
- [ ] Commit with `git add packages/ondo-ui-cli/bin/registry-menu.mjs scripts/ondo-cli.test.ts && git commit -m "feat: classify ondo registry menu items"`.

## Task 2: Shadcn process adapter (TDD)

**Files:** Create `packages/ondo-ui-cli/bin/shadcn-process.mjs`; modify
`scripts/ondo-cli.test.ts`.

**Interfaces:**

- `buildShadcnCommandArgs(command, args)` returns `[command, ...args]`.
- `runShadcn(command, args, options)` invokes `npx --yes shadcn@latest` and
  returns the child exit code; `options.spawnSync` is injectable for tests.

- [ ] Add failing forwarding tests:

```ts
expect(buildShadcnCommandArgs("search", ["@ondo-ui", "--json"])).toEqual([
  "search", "@ondo-ui", "--json",
])
expect(buildShadcnCommandArgs("registry", ["validate"])).toEqual([
  "registry", "validate",
])
```

- [ ] Run the focused test and verify failure due to the missing adapter.
- [ ] Implement platform-safe `npx`/`npx.cmd` invocation with `cwd`, `env`,
  and `stdio: "inherit"`; throw execution errors and return non-zero statuses.
- [ ] Run focused tests and verify green.
- [ ] Commit with `git add packages/ondo-ui-cli/bin/shadcn-process.mjs scripts/ondo-cli.test.ts && git commit -m "feat: delegate ondo commands to shadcn"`.

## Task 3: Full command dispatcher and add menu (TDD)

**Files:** Modify `packages/ondo-ui-cli/bin/ondo-ui.mjs`,
`registry-menu.mjs`, `shadcn-process.mjs`, and `scripts/ondo-cli.test.ts`.

**Public commands:** `init`, `add`, `search`, `list`, `view`, `docs`, `diff`,
`apply`, `info`, `migrate`, `eject`, `mcp`, `preset`, `build`, and `registry`.

- [ ] Add failing tests for parsing `{ command, args }`, explicit add names,
  `--all` selecting exactly Components plus Compositions, empty selection
  returning status 0 without spawning shadcn, and unknown command errors.
- [ ] Run the focused test and verify the expected failures.
- [ ] Implement `add`: explicit names bypass the menu; `--all` selects every
  menu item; otherwise use `prompts` multiselect with disabled group headings;
  normalize names and delegate `shadcn add` while forwarding `--cwd`, `--yes`,
  `--overwrite`, `--path`, `--silent`, `--dry-run`, `--diff`, and `--view`.
- [ ] Implement dispatch: keep current `init`; forward every other listed
  command unchanged. `list` aliases `search`; `build` and `registry` remain
  raw authoring passthroughs. Unknown commands print the complete command list
  and return non-zero.
- [ ] Run focused tests and verify all dispatcher, menu, and init regressions
  pass.
- [ ] Commit with `git add packages/ondo-ui-cli/bin scripts/ondo-cli.test.ts && git commit -m "feat: add full ondo cli command surface"`.

## Task 4: Dependency, docs, and Changeset

**Files:** Modify CLI package metadata, both CLI READMEs, both installation
index pages, and `bun.lock`; create `.changeset/ondo-cli-command-surface.md`.

- [ ] Add runtime dependency `prompts: ^2.4.2`, run `bun install`, and verify
  the CLI package still has no website dependencies.
- [ ] Document these commands in English and Korean:

```bash
bunx --bun @dou.so/ondo-ui init -t astro
bunx --bun @dou.so/ondo-ui add
bunx --bun @dou.so/ondo-ui add button empty-view
bunx --bun @dou.so/ondo-ui search --query button
bunx --bun @dou.so/ondo-ui view @ondo-ui/button
bunx --bun @dou.so/ondo-ui info
```

Explain Components vs Compositions, explicit-only system items, delegated
commands, and `init` versus `add`.
- [ ] Create the Changeset:

```md
---
"@dou.so/ondo-ui": minor
---

Add an Ondo-aware CLI command surface for installing and managing registry items.
```

- [ ] Run `bun run postinstall` and focused CLI tests; commit with
  `git add packages/ondo-ui-cli/package.json packages/ondo-ui-cli/README.md packages/ondo-ui-cli/README_KO.md content/docs/installation/index.mdx content/docs/installation/index.ko.mdx .changeset bun.lock && git commit -m "docs: document ondo cli commands"`.

## Task 5: Verification and package smoke test

- [ ] Run `bun run test`, `bun run typecheck`, `bun run lint`, and `bun run build`.
  Existing lint warnings may remain; new errors are not acceptable.
- [ ] Run `npm pack --dry-run --json` from `packages/ondo-ui-cli`; verify the
  package contains CLI files, READMEs, manifest, and `prompts` metadata only.
- [ ] Run `bunx --bun shadcn@latest add @ondo-ui/button --dry-run` and
  `bunx --bun shadcn@latest add @ondo-ui/empty-view --dry-run`; verify neither
  modifies project files.
- [ ] Run `git diff origin/main...HEAD --check`, `git status --short`, and
  `git log --oneline origin/main..HEAD`; only feature files, docs, Changeset,
  lockfile, and design/plan artifacts may be present.
