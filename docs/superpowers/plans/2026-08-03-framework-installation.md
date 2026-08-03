# Shadcn-Style Installation Navigation and Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match shadcn/ui's installation navigation and guide structure in Ondo UI while preserving Ondo registry behavior and GitHub Pages static export.

**Architecture:** Move the installation overview into the nested installation folder as its `index.mdx`, matching shadcn's source layout. Teach the shared page-tree flattener to expose that folder index while hiding its framework children. Replace the compact guide content with shadcn-style setup cards and framework steps, adapting only links, registry commands, and Ondo-specific examples.

**Tech Stack:** Next.js 16.2.11 App Router, Fumadocs MDX 15.2.1, React 19, shadcn CLI 4.16.0, Tailwind CSS v4, Bun, GitHub Pages static export.

## Global Constraints

- Preserve `output: "export"` and `trailingSlash: true` in `next.config.ts`.
- Keep only the seven existing Ondo framework routes: `next`, `vite`, `tanstack`, `laravel`, `react-router`, `astro`, and `manual`.
- Use `https://ui.shadcn.com/create` for shadcn/create links because Ondo has no local `/create` route.
- Use `https://ui.ondo.dou.so/r/{name}.json` exactly for the Ondo registry namespace.
- Use `/docs/...` in English MDX and `/ko/docs/...` in Korean `LinkedCard` hrefs.
- Do not add a runtime route, API dependency, `basePath`, or component under `components/ui/`.
- Use `apply_patch` for source edits and do not modify generated `.source/`, `out/`, or `public/r` artifacts by hand.

---

### Task 1: Make the installation folder expose one sidebar page

**Files:**
- Create: `lib/page-tree.test.ts`
- Modify: `lib/page-tree.ts`
- Move: `content/docs/installation.mdx` to `content/docs/installation/index.mdx`
- Move: `content/docs/installation.ko.mdx` to `content/docs/installation/index.ko.mdx`

**Interfaces:**
- `getSidebarGroups(tree: PageTree.Root): SidebarGroup[]` continues to serve the desktop sidebar, mobile navigation, and command menu.
- An installation folder with `index` and child pages produces the index page only; all other folders retain their existing flattening behavior.

- [ ] **Step 1: Write the failing sidebar test**

Create a focused fixture using Fumadocs page-tree shapes:

```ts
import type * as PageTree from "fumadocs-core/page-tree"

const installationIndex: PageTree.Item = {
  type: "page",
  name: "Installation",
  url: "/docs/installation",
}

const tree = {
  type: "root",
  name: "Docs",
  children: [
    {
      type: "folder",
      $id: "en:installation",
      $ref: { folder: "installation" },
      name: "Frameworks",
      index: installationIndex,
      children: [
        {
          type: "page",
          name: "Next",
          url: "/docs/installation/next",
        },
      ],
    },
  ],
} satisfies PageTree.Root
```

The test must assert that the flattened pages equal `[installationIndex]` and do not include `/docs/installation/next`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bun test lib/page-tree.test.ts`

Expected: FAIL because the current flattener emits the child page and does not emit the folder index.

- [ ] **Step 3: Implement the minimal installation-folder boundary**

In `collectPages`, handle folders with `$ref?.folder === "installation"` before the generic recursion:

```ts
if (node.$ref?.folder === "installation") {
  if (node.index) acc.push(node.index)
  return
}
```

Leave all other folder recursion unchanged. This uses the generated tree's stable folder reference and keeps the root `Installation` item available to all existing navigation consumers.

- [ ] **Step 4: Move the overview pages into the Fumadocs folder index**

Move the English and Korean overview files to `content/docs/installation/index.mdx` and `content/docs/installation/index.ko.mdx`. Do not change their route links during the move; Fumadocs will continue to publish `/docs/installation/` and `/ko/docs/installation/`.

- [ ] **Step 5: Run the focused test and regenerate the MDX source**

Run: `bun test lib/page-tree.test.ts && bun run postinstall`

Expected: PASS, and the generated page tree contains an installation folder with an `index` page and framework children.

- [ ] **Step 6: Commit the sidebar boundary**

```bash
git add lib/page-tree.ts lib/page-tree.test.ts content/docs/installation/index.mdx content/docs/installation/index.ko.mdx
git commit -m "fix: collapse installation guides in navigation"
```

### Task 2: Rebuild the overview to match shadcn's chooser

**Files:**
- Modify: `content/docs/installation/index.mdx`
- Modify: `content/docs/installation/index.ko.mdx`
- Read-only reference: `/Users/initred/Code/ui/apps/v4/content/docs/installation/index.mdx`

**Interfaces:**
- The English and Korean index pages render the same three setup cards and seven framework cards.
- All framework cards link to the existing localized detail routes.

- [ ] **Step 1: Add the setup cards and anchor sections to English**

Match shadcn's frontmatter and opening layout:

```mdx
---
title: Installation
description: How to install dependencies and structure your app.
---
```

Use the existing `Callout`, `LinkedCard`, `Button`, and `Link` MDX components. Add the three cards with these exact labels/descriptions and anchors:

```mdx
<LinkedCard href="#use-create">
  <div className="font-medium">Use shadcn/create</div>
  <div className="leading-relaxed text-muted-foreground">
    Build your preset visually and generate a setup command.
  </div>
</LinkedCard>
<LinkedCard href="#use-cli">
  <div className="font-medium">Use the CLI</div>
  <div className="leading-relaxed text-muted-foreground">
    Scaffold a supported template directly from the terminal.
  </div>
</LinkedCard>
<LinkedCard href="#existing-project">
  <div className="font-medium">Existing Project</div>
  <div className="leading-relaxed text-muted-foreground">
    Add Ondo UI to an app you already created.
  </div>
</LinkedCard>
```

Add the `Use shadcn/create` section with an external `Button` link to `https://ui.shadcn.com/create`, the `Use the CLI` section with `bunx shadcn@latest init -t [framework]`, and the `Existing Project` section before `Choose Your Framework`. Keep the Ondo registry/theme/component instructions after the framework chooser.

- [ ] **Step 2: Replace the framework icon grid with shadcn-compatible inline logos**

Use the inline SVG paths from the reference shadcn index for Next.js, Vite, TanStack Start, Laravel, React Router, and Astro. Use the existing React logo path for Manual. Preserve Ondo's seven slugs and these English hrefs:

```text
/docs/installation/next
/docs/installation/vite
/docs/installation/tanstack
/docs/installation/laravel
/docs/installation/react-router
/docs/installation/astro
/docs/installation/manual
```

Use the same `sm:grid-cols-2`/`sm:gap-6` responsive grid as the reference.

- [ ] **Step 3: Mirror the structure in Korean**

Translate headings, card descriptions, callout, CLI guidance, and Ondo setup text while preserving the same layout and explicit Korean card hrefs:

```text
/ko/docs/installation/next
/ko/docs/installation/vite
/ko/docs/installation/tanstack
/ko/docs/installation/laravel
/ko/docs/installation/react-router
/ko/docs/installation/astro
/ko/docs/installation/manual
```

Use `https://ui.shadcn.com/create` for the external create button in Korean as well. Keep normal Markdown theming links as `/docs/theming` so Ondo's locale-aware anchor wrapper adds `/ko` exactly once.

- [ ] **Step 4: Regenerate MDX and run the route tests**

Run: `bun run postinstall && bun test app/_shared/docs/route-helpers.test.ts lib/page-tree.test.ts`

Expected: PASS with the root installation route and all nested framework routes present in both locales.

- [ ] **Step 5: Commit the overview update**

```bash
git add content/docs/installation/index.mdx content/docs/installation/index.ko.mdx
git commit -m "docs: match shadcn installation chooser"
```

### Task 3: Expand the English framework guides using shadcn's setup flow

**Files:**
- Modify: `content/docs/installation/next.mdx`
- Modify: `content/docs/installation/vite.mdx`
- Modify: `content/docs/installation/tanstack.mdx`
- Modify: `content/docs/installation/laravel.mdx`
- Modify: `content/docs/installation/react-router.mdx`
- Modify: `content/docs/installation/astro.mdx`
- Modify: `content/docs/installation/manual.mdx`
- Read-only references: `/Users/initred/Code/ui/apps/v4/content/docs/installation/next.mdx`, `vite.mdx`, `tanstack.mdx`, `laravel.mdx`, `react-router.mdx`, `astro.mdx`, `manual.mdx`

**Interfaces:**
- Each page keeps its current route slug and adds the same three setup choices as the reference.
- Ondo-specific registry/theme/component snippets are present in every page.

- [ ] **Step 1: Add the shared setup-choice structure and frontmatter**

Each English page must use framework-specific frontmatter and three cards:

| File | Title | Description | shadcn/create template | CLI command |
| --- | --- | --- | --- | --- |
| `next.mdx` | `Next.js` | `Install and configure Ondo UI for Next.js.` | `next` | `npx shadcn@latest init -t next` |
| `vite.mdx` | `Vite` | `Install and configure Ondo UI for Vite.` | `vite` | `npx shadcn@latest init -t vite` |
| `tanstack.mdx` | `TanStack Start` | `Install and configure Ondo UI for TanStack Start.` | `start` | `npx shadcn@latest init -t start` |
| `laravel.mdx` | `Laravel` | `Install and configure Ondo UI for Laravel.` | none | `laravel new my-app` then `npx shadcn@latest init` |
| `react-router.mdx` | `React Router` | `Install and configure Ondo UI for React Router.` | `react-router` | `npx shadcn@latest init -t react-router` |
| `astro.mdx` | `Astro` | `Install and configure Ondo UI for Astro.` | `astro` | `npx shadcn@latest init -t astro` |
| `manual.mdx` | `Manual` | `Add Ondo UI to an existing project manually.` | none | `npx shadcn@latest init` |

The three cards use `#scaffold-with-create`, `#scaffold-with-cli`, and `#existing-<framework>-project` anchors, matching each reference page's labels. Use `https://ui.shadcn.com/create?template=<template>` for supported create templates.

- [ ] **Step 2: Port the framework-specific shadcn/create and CLI sections**

For each supported template, include the reference's `Steps` sequence for building a preset, creating the project, and adding a component. Keep the command examples package-manager-neutral where the existing MDX transformer expects `npx`. Laravel documents `laravel new` first. Manual omits project scaffolding and starts from Tailwind CSS v4, `components.json`, and `cn()` prerequisites.

- [ ] **Step 3: Adapt existing-project instructions framework by framework**

Retain the reference's framework-specific setup details:

- Next.js: create-next-app, Tailwind/import aliases, shadcn init, then add a component.
- Vite: Vite scaffold, Tailwind Vite plugin, `src/index.css`, TypeScript aliases, `vite.config.ts`, shadcn init, then add a component.
- TanStack Start: the reference's TanStack project scaffold, Tailwind setup, aliases, shadcn init, then add a component.
- Laravel: Laravel creation, frontend setup, Tailwind/Vite configuration, shadcn init, then add a component.
- React Router: React Router scaffold, Tailwind setup, aliases, shadcn init, then add a component.
- Astro: Astro scaffold, React integration, Tailwind setup, aliases, shadcn init, then add a component.
- Manual: existing project's Tailwind, alias, `components.json`, and shadcn init requirements.

Replace shadcn local component installation in each final add-component section with `npx shadcn@latest add @ondo-ui/button` and keep the existing Ondo `Button` usage example.

- [ ] **Step 4: Insert the Ondo registry and theme setup into every English guide**

In each existing-project flow, add the following before adding Ondo components:

```json title="components.json"
{
  "registries": {
    "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @ondo-ui/theme @ondo-ui/theme-provider
npx shadcn@latest add @ondo-ui/button
```

Link to `/docs/theming` for the provider setup. Preserve the exact registry URL and explain that the provider is optional only when dark-mode switching is not used.

- [ ] **Step 5: Regenerate MDX and check all English route params**

Run: `bun run postinstall && bun test app/_shared/docs/route-helpers.test.ts`

Expected: PASS with no MDX syntax or code-block transformation errors.

- [ ] **Step 6: Commit the English guides**

```bash
git add content/docs/installation/next.mdx content/docs/installation/vite.mdx content/docs/installation/tanstack.mdx content/docs/installation/laravel.mdx content/docs/installation/react-router.mdx content/docs/installation/astro.mdx content/docs/installation/manual.mdx
git commit -m "docs: align English framework installation guides"
```

### Task 4: Localize the expanded framework guides in Korean

**Files:**
- Modify: `content/docs/installation/next.ko.mdx`
- Modify: `content/docs/installation/vite.ko.mdx`
- Modify: `content/docs/installation/tanstack.ko.mdx`
- Modify: `content/docs/installation/laravel.ko.mdx`
- Modify: `content/docs/installation/react-router.ko.mdx`
- Modify: `content/docs/installation/astro.ko.mdx`
- Modify: `content/docs/installation/manual.ko.mdx`

**Interfaces:**
- Korean framework pages have the same sections, commands, registry URL, and component examples as the English pages.
- Korean prose is localized while commands, JSON keys, paths, and package names remain executable.

- [ ] **Step 1: Mirror each English page's structure and command blocks**

Translate the setup cards, section headings, step descriptions, and explanatory prose. Keep every framework's exact CLI command and framework-specific configuration from Task 3.

- [ ] **Step 2: Apply Korean link conventions**

Use explicit `/ko/docs/...` paths for `LinkedCard` framework links. Use `/docs/theming` in normal Markdown links so the localized anchor component produces `/ko/docs/theming` without double-prefixing.

- [ ] **Step 3: Verify registry and component snippets**

Every Korean page must contain both exact strings:

```text
https://ui.ondo.dou.so/r/{name}.json
npx shadcn@latest add @ondo-ui/button
```

- [ ] **Step 4: Regenerate MDX and run localized route tests**

Run: `bun run postinstall && bun test app/_shared/docs/route-helpers.test.ts lib/page-tree.test.ts`

Expected: PASS with all Korean installation routes generated.

- [ ] **Step 5: Commit the Korean guides**

```bash
git add content/docs/installation/next.ko.mdx content/docs/installation/vite.ko.mdx content/docs/installation/tanstack.ko.mdx content/docs/installation/laravel.ko.mdx content/docs/installation/react-router.ko.mdx content/docs/installation/astro.ko.mdx content/docs/installation/manual.ko.mdx
git commit -m "docs: align Korean framework installation guides"
```

### Task 5: Verify static export coverage and quality

**Files:**
- Verify: `scripts/smoke-static-export.ts`

**Interfaces:**
- `installationFrameworks` is the single source of truth for the seven English and Korean installation URLs requested by the smoke test.

- [ ] **Step 1: Confirm the smoke-test framework list**

Keep this exact list and derive both locale paths from it:

```ts
const installationFrameworks = [
  "next",
  "vite",
  "tanstack",
  "laravel",
  "react-router",
  "astro",
  "manual",
] as const
```

The test must request `/docs/installation/`, `/ko/docs/installation/`, and both locale paths for every framework.

- [ ] **Step 2: Run the complete automated checks**

Run:

```bash
bun run test
bun run lint
bun run typecheck
bun run build
```

Expected: all tests pass, lint has no errors, typecheck succeeds, and static export verification reports all required paths.

- [ ] **Step 3: Run the static smoke test against the generated export**

Run:

```bash
python3 -m http.server 4173 --directory out
bun run scripts/smoke-static-export.ts http://127.0.0.1:4173
```

Expected: the overview plus 14 localized framework URLs report `PASS`, with no missing HTML pages or registry/search regressions. Stop the temporary server after the command.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff --check && git status --short`

Confirm that only source MDX, sidebar logic/tests, smoke coverage, and the design/plan documents changed; generated artifacts remain uncommitted. The current smoke test already derives all seven framework URLs from `installationFrameworks`, so no source change is required unless an earlier task accidentally removes that coverage.
