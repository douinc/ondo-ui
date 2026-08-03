# Framework Installation Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shadcn-style framework-specific Ondo UI installation pages for seven frameworks, with localized routes and GitHub Pages static-export coverage.

**Architecture:** Keep the existing Fumadocs catch-all route and add nested MDX pages under `content/docs/installation/`. The root installation pages render localized `LinkedCard` grids, while each framework page documents the framework initializer followed by the existing Ondo registry/theme/component flow. Extend the existing static smoke test so every generated installation route is required.

**Tech Stack:** Next.js 16.2.11 App Router, Fumadocs MDX 15.2.1, React 19, shadcn CLI 4.16.0, Tailwind CSS v4, Bun, GitHub Pages static export.

## Global Constraints

- Preserve `output: "export"` and `trailingSlash: true` in `next.config.ts`.
- Use `bunx shadcn@latest` in source MDX so the existing package-manager code transformer produces npm, pnpm, yarn, and bun variants.
- Use the registry URL `https://ui.ondo.dou.so/r/{name}.json` exactly.
- Provide both English and Korean content for every framework route.
- Use `/docs/...` links in English MDX and `/ko/docs/...` links in Korean MDX because `LinkedCard` is a direct `next/link` component and does not pass through the localized anchor wrapper.
- Do not add a runtime route, API dependency, `basePath`, or component under `components/ui/`.
- Do not change the existing registry payloads or generated `public/r` artifacts by hand.

---

### Task 1: Cover all framework routes in the static smoke test

**Files:**
- Modify: `scripts/smoke-static-export.ts`

**Interfaces:**
- Produces a single `installationFrameworks` constant and derived `paths`/`htmlPaths` sets used by the existing smoke test.
- The framework slugs are exactly `next`, `vite`, `tanstack`, `laravel`, `react-router`, `astro`, and `manual`.

- [ ] **Step 1: Add the framework slug list and derived URL paths**

Insert the following constants before `paths` and replace the hard-coded installation entries in `paths` and `htmlPaths`:

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

const installationPaths = installationFrameworks.flatMap((framework) => [
  `/docs/installation/${framework}/`,
  `/ko/docs/installation/${framework}/`,
])

const paths = [
  "/",
  "/ko/",
  "/docs/installation/",
  "/ko/docs/installation/",
  ...installationPaths,
  "/docs.md",
  "/docs/components/button.md",
  "/llm/en",
  "/llm/ko",
  "/api/search",
  "/r/registry.json",
  "/r/button.json",
] as const

const htmlPaths = new Set([
  "/",
  "/ko/",
  "/docs/installation/",
  "/ko/docs/installation/",
  ...installationPaths,
])
```

Keep the existing Markdown, search, and registry assertions unchanged.

- [ ] **Step 2: Run the type checker**

Run: `bun run typecheck`

Expected: PASS. The new derived arrays are accepted by the existing `paths` and `htmlPaths` consumers.

- [ ] **Step 3: Commit the smoke-test coverage**

```bash
git add scripts/smoke-static-export.ts
git commit -m "test: cover framework installation routes"
```

### Task 2: Add the localized overview cards and sidebar order

**Files:**
- Create: `content/docs/installation/meta.json`
- Modify: `content/docs/installation.mdx`
- Modify: `content/docs/installation.ko.mdx`

**Interfaces:**
- `content/docs/installation/meta.json` controls the child-page order in the installation section.
- The two root MDX pages link to the exact seven child slugs and preserve the existing registry installation content.

- [ ] **Step 1: Register the child-page order**

Create `content/docs/installation/meta.json` with:

```json
{
  "title": "Frameworks",
  "pages": [
    "next",
    "vite",
    "tanstack",
    "laravel",
    "react-router",
    "astro",
    "manual"
  ]
}
```

- [ ] **Step 2: Replace the English overview body with the framework chooser**

Keep the existing frontmatter title `Installation`, and change the description to `Install Ondo UI in a new or existing project.`. The body must include:

```mdx
<Callout className="mb-6 border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900">

**Recommended for new projects:** Initialize your framework with the shadcn CLI, then register the `@ondo-ui` registry and install the theme.

</Callout>

## Use the CLI

Use the CLI to scaffold a supported project:

```bash
bunx shadcn@latest init -t [framework]
```

Supported templates: `next`, `vite`, `start`, `react-router`, and `astro`. For Laravel, create the app first with `laravel new`, then run `bunx shadcn@latest init`.

## Existing Project

If your project already exists, choose its framework below and follow the registry setup steps on that page.

## Choose Your Framework

<div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
  <LinkedCard href="/docs/installation/next">
    <IconBrandNextjs className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">Next.js</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/vite">
    <IconBrandVite className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">Vite</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/tanstack">
    <IconBinaryTree className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">TanStack Start</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/laravel">
    <IconBrandLaravel className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">Laravel</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/react-router">
    <IconBrandReact className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">React Router</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/astro">
    <IconBrandAstro className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">Astro</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/manual">
    <IconBraces className="h-10 w-10" aria-hidden="true" />
    <p className="mt-2 font-medium">Manual</p>
  </LinkedCard>
</div>
```

Add this import at the top of the MDX file:

```mdx
import {
  IconBinaryTree,
  IconBraces,
  IconBrandAstro,
  IconBrandLaravel,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandVite,
} from "@tabler/icons-react"
```

After the chooser, retain the existing registry registration, theme installation, component installation, and `Button` usage example. Change the opening prerequisite text so it points users to the framework cards when starting fresh.

- [ ] **Step 3: Add the Korean overview with locale-prefixed card links**

Keep the existing frontmatter title `설치`, and change the description to `새 프로젝트 또는 기존 프로젝트에 Ondo UI를 설치합니다.`. Translate the English overview copy and use the same seven cards, but use these exact `href` values:

```text
/ko/docs/installation/next
/ko/docs/installation/vite
/ko/docs/installation/tanstack
/ko/docs/installation/laravel
/ko/docs/installation/react-router
/ko/docs/installation/astro
/ko/docs/installation/manual
```

Keep the current Korean registry, theme, component, and usage examples after the chooser.

- [ ] **Step 4: Build the MDX source**

Run: `bun run postinstall`

Expected: Fumadocs regenerates `.source/` without MDX or frontmatter errors.

- [ ] **Step 5: Commit the overview and metadata**

```bash
git add content/docs/installation.mdx content/docs/installation.ko.mdx content/docs/installation/meta.json
git commit -m "docs: add framework installation chooser"
```

### Task 3: Add the English framework installation guides

**Files:**
- Create: `content/docs/installation/next.mdx`
- Create: `content/docs/installation/vite.mdx`
- Create: `content/docs/installation/tanstack.mdx`
- Create: `content/docs/installation/laravel.mdx`
- Create: `content/docs/installation/react-router.mdx`
- Create: `content/docs/installation/astro.mdx`
- Create: `content/docs/installation/manual.mdx`

**Interfaces:**
- Each page is available at `/docs/installation/<slug>/` through the existing catch-all route.
- Every page has the same registry, theme, component, and usage snippets so users can move between framework guides without learning a different Ondo flow.

- [ ] **Step 1: Create the framework frontmatter and initialization sections**

Use these exact title/description/initialization values:

| File | `title` | `description` | New project command |
| --- | --- | --- | --- |
| `next.mdx` | `Next.js` | `Install Ondo UI in a Next.js project.` | `bunx shadcn@latest init -t next` |
| `vite.mdx` | `Vite` | `Install Ondo UI in a Vite project.` | `bunx shadcn@latest init -t vite` |
| `tanstack.mdx` | `TanStack Start` | `Install Ondo UI in a TanStack Start project.` | `bunx shadcn@latest init -t start` |
| `laravel.mdx` | `Laravel` | `Install Ondo UI in a Laravel project.` | `laravel new my-app` followed by `bunx shadcn@latest init` |
| `react-router.mdx` | `React Router` | `Install Ondo UI in a React Router project.` | `bunx shadcn@latest init -t react-router` |
| `astro.mdx` | `Astro` | `Install Ondo UI in an Astro project.` | `bunx shadcn@latest init -t astro` |
| `manual.mdx` | `Manual` | `Add Ondo UI to an existing project manually.` | `bunx shadcn@latest init` for an existing shadcn-compatible project |

Every page must begin with `## Create a new project` and show the command in a `bash` block. Laravel must show:

```bash
laravel new my-app
cd my-app
bunx shadcn@latest init
```

The manual page must explain that it is for a project that does not use one of the supported templates and that the project still needs Tailwind CSS v4, a `components.json`, and the shadcn `cn()` utility.

- [ ] **Step 2: Add the common registry and installation sections to every English page**

After the initialization section, add these exact sections to all seven files:

```mdx
## Register the registry

Add the `@ondo-ui` namespace to the `registries` field of your `components.json`:

```json title="components.json"
{
  "registries": {
    "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
  }
}
```

## Add the theme

Install the Ondo theme. It adds Pretendard, Monaspace Neon, and the base CSS variables:

```bash
bunx shadcn@latest add @ondo-ui/theme @ondo-ui/theme-provider
```

`@ondo-ui/theme-provider` is optional when the framework is not using React dark-mode switching. If it is installed, follow the [theming guide](/docs/theming) to add `ThemeProvider` to the application root.

## Add a component

```bash
bunx shadcn@latest add @ondo-ui/button
```

Dependencies such as `utils` are resolved automatically.

## Use the component

```tsx
import { Button } from "@/components/ui/button"

export default function Example() {
  return <Button>Click me</Button>
}
```
```

For the Astro page, state that the component should be rendered through the project’s configured React integration. For Laravel, state that the component belongs in the configured frontend source directory generated by the shadcn setup.

- [ ] **Step 3: Confirm all English links and commands**

Run:

```bash
rg -n 'https://ui\.ondo\.dou\.so/r/\{name\}\.json|bunx shadcn@latest add @ondo-ui/(theme|theme-provider|button)' content/docs/installation/*.mdx content/docs/installation/*.mdx
```

Expected: every English framework file contains the registry URL, theme command, and button command; no framework page may be missing any of them.

- [ ] **Step 4: Commit the English guides**

```bash
git add content/docs/installation/*.mdx
git commit -m "docs: add English framework installation guides"
```

### Task 4: Add the Korean framework installation guides

**Files:**
- Create: `content/docs/installation/next.ko.mdx`
- Create: `content/docs/installation/vite.ko.mdx`
- Create: `content/docs/installation/tanstack.ko.mdx`
- Create: `content/docs/installation/laravel.ko.mdx`
- Create: `content/docs/installation/react-router.ko.mdx`
- Create: `content/docs/installation/astro.ko.mdx`
- Create: `content/docs/installation/manual.ko.mdx`

**Interfaces:**
- Each page is available at `/ko/docs/installation/<slug>/` through the existing Korean catch-all route.
- Korean pages use the same command blocks and registry URL as English pages, with Korean prose and localized internal links.

- [ ] **Step 1: Create the Korean frontmatter and initialization sections**

Use these exact title/description values and translate the corresponding English initialization section:

| File | `title` | `description` |
| --- | --- | --- |
| `next.ko.mdx` | `Next.js` | `Next.js 프로젝트에 Ondo UI를 설치합니다.` |
| `vite.ko.mdx` | `Vite` | `Vite 프로젝트에 Ondo UI를 설치합니다.` |
| `tanstack.ko.mdx` | `TanStack Start` | `TanStack Start 프로젝트에 Ondo UI를 설치합니다.` |
| `laravel.ko.mdx` | `Laravel` | `Laravel 프로젝트에 Ondo UI를 설치합니다.` |
| `react-router.ko.mdx` | `React Router` | `React Router 프로젝트에 Ondo UI를 설치합니다.` |
| `astro.ko.mdx` | `Astro` | `Astro 프로젝트에 Ondo UI를 설치합니다.` |
| `manual.ko.mdx` | `수동 설치` | `기존 프로젝트에 Ondo UI를 수동으로 추가합니다.` |

Use `## 새 프로젝트 만들기`, the exact framework command from Task 3, and `## 기존 프로젝트` before the registry steps. The Laravel Korean command remains:

```bash
laravel new my-app
cd my-app
bunx shadcn@latest init
```

- [ ] **Step 2: Add the translated common sections**

Each Korean page must include these sections in order:

```text
## 레지스트리 등록
## 테마 추가
## 컴포넌트 추가
## 컴포넌트 사용
```

Use the exact registry URL and command blocks from Task 3. Translate the optional `theme-provider` note, link it to `/ko/docs/theming`, and keep the Button example text as `클릭`.

- [ ] **Step 3: Verify locale links**

Run:

```bash
rg -n 'href="/docs/|\]\(/docs/' content/docs/installation/*.ko.mdx
```

Expected: no output for framework links that should point to Korean pages. The only permitted `/docs/` references in Korean installation pages are external documentation URLs intentionally written as absolute `https://...` links, not local relative links.

- [ ] **Step 4: Commit the Korean guides**

```bash
git add content/docs/installation/*.ko.mdx
git commit -m "docs: add Korean framework installation guides"
```

### Task 5: Build, inspect, and verify the static export

**Files:**
- Verify: `out/docs/installation/` and `out/ko/docs/installation/` generated output
- Verify: `.generated/` and `out/` are build artifacts and are not committed unless already tracked by repository policy

**Interfaces:**
- The final build must expose all fourteen localized framework pages as static directories with `index.html`.
- The existing registry and Markdown artifact generation must remain valid.

- [ ] **Step 1: Run unit tests, lint, and typecheck**

Run:

```bash
bun run test
bun run lint
bun run typecheck
```

Expected: all commands exit with status 0.

- [ ] **Step 2: Build the complete static site**

Run: `bun run build`

Expected: `artifacts:build`, `registry:build`, `next build`, `export:finalize`, and `export:verify` all pass. The export verifier must report no missing local links or missing required paths.

- [ ] **Step 3: Check every generated framework page directly**

Run:

```bash
for framework in next vite tanstack laravel react-router astro manual; do
  test -f "out/docs/installation/$framework/index.html"
  test -f "out/ko/docs/installation/$framework/index.html"
done
```

Expected: the loop exits successfully with no output.

- [ ] **Step 4: Check the generated overview links**

Run:

```bash
for framework in next vite tanstack laravel react-router astro manual; do
  rg -q "/docs/installation/$framework" out/docs/installation/index.html
  rg -q "/ko/docs/installation/$framework" out/ko/docs/installation/index.html
done
```

Expected: every card link is present in the correct locale’s HTML.

- [ ] **Step 5: Review the final diff and commit verification-safe changes**

Run: `git diff --check && git status --short`

Expected: no whitespace errors, no accidental edits to generated registry JSON, and only the planned documentation and smoke-test files are changed.
