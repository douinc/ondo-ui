# Theme Registry Comment Preservation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the changed Ondo theme across the site, installable registry, and bilingual chart docs, and make `shadcn add @ondo-ui/theme` preserve inline color comments.

**Architecture:** Keep `app/globals.css` as the authored site stylesheet and `registry.json` as the shadcn install payload. Store each registry light/dark value as valid CSS followed by an inline comment, then enforce exact value-and-comment parity with a Bun contract test and an end-to-end local shadcn installation test.

**Tech Stack:** Tailwind CSS v4, shadcn registry schema and CLI 4.16.0, PostCSS, Bun tests, Fumadocs MDX.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-05-theme-registry-comments-design.md` as the source of truth.
- Preserve the user's existing `app/globals.css` value changes.
- Work on `fix/theme-registry-comments`; do not add implementation commits directly to protected `main`.
- Do not add, rename, remove, or re-register anything under `components/ui/`.
- Keep registry variables under `cssVars`; do not duplicate them under `css` and do not ship a replacement global CSS file.
- Every `cssVars.light` and `cssVars.dark` value, including `radius`, must end with a descriptive `/* ... */` comment.
- English and Korean chart documentation must remain synchronized.
- Do not manually edit ignored files under `public/r`; regenerate them with `bun run registry:build`.
- Do not add unrelated theme tokens or component restyles unless a concrete verification failure requires them.

---

## File Map

### Create

- `scripts/theme-registry.test.ts` — globals/registry/docs parity and local shadcn installation coverage.

### Modify

- `app/globals.css` — correct touched comment labels while retaining the new values.
- `registry.json` — synchronize light/dark values and embed inline comments in the install payload.
- `content/docs/components/chart.mdx` — update the English chart token examples.
- `content/docs/components/chart.ko.mdx` — update the Korean chart token examples.

### Generated and ignored

- `public/r/theme.json` — rebuilt registry item used for verification.
- `public/r/registry.json` — rebuilt registry index used for verification.

---

### Task 1: Add failing theme registry contract tests

**Files:**

- Create: `scripts/theme-registry.test.ts`
- Read: `app/globals.css`
- Read: `registry.json`
- Read: `content/docs/components/chart.mdx`
- Read: `content/docs/components/chart.ko.mdx`

**Interfaces:**

- Consumes: the `theme` registry item with `cssVars.light` and `cssVars.dark` string maps.
- Produces: test-only `extractVariables(css, selector)` and `installThemeCss(theme)` helpers.
- Contract: each registry light/dark value exactly equals its matching declaration value plus comment from `app/globals.css`.
- Contract: a local `shadcn add` run writes comment-bearing registry values into a consumer's CSS without stripping the comments.

- [ ] **Step 1: Create the focused test with real registry data**

Create `scripts/theme-registry.test.ts`:

```ts
import { afterAll, describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

type ThemeItem = {
  name: string
  type: string
  cssVars?: {
    theme?: Record<string, string>
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  [key: string]: unknown
}

type Registry = {
  items: ThemeItem[]
}

const repoRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)))
const temporaryProjects: string[] = []

async function readThemeInputs() {
  const [globals, registryText, chartEn, chartKo] = await Promise.all([
    readFile(join(repoRoot, "app/globals.css"), "utf8"),
    readFile(join(repoRoot, "registry.json"), "utf8"),
    readFile(join(repoRoot, "content/docs/components/chart.mdx"), "utf8"),
    readFile(join(repoRoot, "content/docs/components/chart.ko.mdx"), "utf8"),
  ])
  const registry = JSON.parse(registryText) as Registry
  const theme = registry.items.find((item) => item.name === "theme")
  if (!theme?.cssVars?.light || !theme.cssVars.dark) {
    throw new Error("The theme registry item must define light and dark cssVars")
  }
  return { globals, theme, chartEn, chartKo }
}

function extractVariables(css: string, selector: ":root" | ".dark") {
  const selectorStart = css.indexOf(`${selector} {`)
  if (selectorStart < 0) throw new Error(`Missing ${selector} theme block`)
  const blockStart = css.indexOf("{", selectorStart) + 1
  const blockEnd = css.indexOf("\n}", blockStart)
  if (blockEnd < 0) throw new Error(`Unclosed ${selector} theme block`)

  return new Map(
    [...css.slice(blockStart, blockEnd).matchAll(/^\s*--([\w-]+):\s*(.+);\s*$/gm)].map(
      ([, name, value]) => [name, value.trim()]
    )
  )
}

async function installThemeCss(theme: ThemeItem) {
  const project = await mkdtemp(join(tmpdir(), "ondo-theme-registry-"))
  temporaryProjects.push(project)
  const appDir = join(project, "app")
  await mkdir(appDir)

  const installItem = {
    ...theme,
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    dependencies: [],
    css: {},
  }
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch(request) {
      return new URL(request.url).pathname === "/theme.json"
        ? Response.json(installItem)
        : new Response("Not found", { status: 404 })
    },
  })

  try {
    await Promise.all([
      writeFile(
        join(project, "package.json"),
        JSON.stringify({
          private: true,
          dependencies: { react: "19.2.4", tailwindcss: "^4.3.3" },
        })
      ),
      writeFile(
        join(project, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "base-vega",
          rsc: true,
          tsx: true,
          tailwind: {
            config: "",
            css: "app/globals.css",
            baseColor: "zinc",
            cssVariables: true,
            prefix: "",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            ui: "@/components/ui",
            lib: "@/lib",
            hooks: "@/hooks",
          },
          registries: {
            "@test": `http://127.0.0.1:${server.port}/{name}.json`,
          },
        })
      ),
      writeFile(join(appDir, "globals.css"), '@import "tailwindcss";\n'),
    ])

    const child = Bun.spawn(
      [
        globalThis.process.execPath,
        join(repoRoot, "node_modules/shadcn/dist/index.js"),
        "add",
        "@test/theme",
        "--yes",
        "--overwrite",
        "--silent",
        "--cwd",
        project,
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
        env: { ...globalThis.process.env, CI: "1" },
      }
    )
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ])
    if (exitCode !== 0) {
      throw new Error(`shadcn add failed\n${stdout}\n${stderr}`)
    }
    return readFile(join(appDir, "globals.css"), "utf8")
  } finally {
    server.stop(true)
  }
}

afterAll(async () => {
  await Promise.all(
    temporaryProjects.map((project) =>
      rm(project, { recursive: true, force: true })
    )
  )
})

describe("theme registry", () => {
  test("matches every exported global variable including its comment", async () => {
    const { globals, theme } = await readThemeInputs()
    for (const [mode, selector] of [
      ["light", ":root"],
      ["dark", ".dark"],
    ] as const) {
      const declarations = extractVariables(globals, selector)
      for (const [name, value] of Object.entries(theme.cssVars?.[mode] ?? {})) {
        expect(value).toMatch(/\/\* .+ \*\/$/)
        expect(value).toBe(declarations.get(name))
      }
    }
  })

  test("keeps chart documentation synchronized in both locales", async () => {
    const { theme, chartEn, chartKo } = await readThemeInputs()
    for (const [name, valueWithComment] of Object.entries(
      theme.cssVars?.light ?? {}
    )) {
      if (!name.startsWith("chart-")) continue
      const value = valueWithComment.replace(/\s*\/\*.*\*\/$/, "")
      const declaration = `--${name}: ${value};`
      const expectedCount = name === "chart-1" || name === "chart-2" ? 4 : 2

      for (const document of [chartEn, chartKo]) {
        expect(document.split(declaration).length - 1).toBe(expectedCount)
      }
    }
  })

  test(
    "preserves registry comments in CSS installed by shadcn",
    async () => {
      const { theme } = await readThemeInputs()
      const css = await installThemeCss(theme)
      expect(css).toContain(
        "--primary: oklch(62.3% 0.214 259.815) /* blue-500 */;"
      )
      expect(css).toContain(
        "--radius: 0.625rem /* Spacing-2.5 10px */;"
      )
    },
    30_000
  )
})
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
bun test scripts/theme-registry.test.ts
```

Expected: FAIL because the current registry values do not include comments, still contain the old chart/dark values, and the installed CSS therefore lacks `/* blue-500 */` and the radius comment.

- [ ] **Step 3: Commit the failing contract test**

```bash
git add scripts/theme-registry.test.ts
git commit -m "test: Cover theme registry synchronization"
```

---

### Task 2: Synchronize theme values and preserve comments

**Files:**

- Modify: `app/globals.css:83-163`
- Modify: `registry.json:47-115`

**Interfaces:**

- Consumes: the already-authored light and dark CSS values in `app/globals.css`.
- Produces: comment-bearing `cssVars.light` and `cssVars.dark` strings consumed by shadcn.
- Invariant: stripping the trailing comment from a registry value leaves the same CSS value authored in globals.

- [ ] **Step 1: Correct comments in the authored globals**

Use these labels for declarations touched by the work:

```css
--border: oklch(92% 0.004 286.32); /* zinc-200 */
--input: oklch(92% 0.004 286.32); /* zinc-200 */
--sidebar-foreground: oklch(0.141 0.005 285.823); /* zinc-950 */
```

Replace every `netural-*` spelling in the dark block with `neutral-*`. Retain
all approved color values, including light `chart-3` and the new dark palette.

- [ ] **Step 2: Replace the registry light and dark maps with synchronized commented values**

Every value in `registry.json` must use this representation:

```json
"light": {
  "background": "oklch(1 0 0) /* white */",
  "foreground": "oklch(13% 0.028 261.692) /* gray-950 */",
  "card": "oklch(1 0 0) /* white */",
  "card-foreground": "oklch(13% 0.028 261.692) /* gray-950 */",
  "popover": "oklch(1 0 0) /* white */",
  "popover-foreground": "oklch(13% 0.028 261.692) /* gray-950 */",
  "primary": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "primary-foreground": "oklch(1 0 0) /* white */",
  "secondary": "oklch(96.7% 0.001 286.375) /* zinc-100 */",
  "secondary-foreground": "oklch(0.21 0.006 285.885) /* zinc-900 */",
  "muted": "oklch(96.7% 0.001 286.375) /* zinc-100 */",
  "muted-foreground": "oklch(55.1% 0.027 264.364) /* gray-500 */",
  "accent": "oklch(96.7% 0.001 286.375) /* zinc-100 */",
  "accent-foreground": "oklch(21% 0.006 285.885) /* zinc-900 */",
  "destructive": "oklch(63.7% 0.237 25.331) /* red-500 */",
  "border": "oklch(92% 0.004 286.32) /* zinc-200 */",
  "input": "oklch(92% 0.004 286.32) /* zinc-200 */",
  "ring": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "chart-1": "oklch(80.9% 0.105 251.813) /* blue-300 */",
  "chart-2": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "chart-3": "oklch(54.6% 0.245 262.881) /* blue-600 */",
  "chart-4": "oklch(48.8% 0.243 264.376) /* blue-700 */",
  "chart-5": "oklch(42.4% 0.199 265.638) /* blue-800 */",
  "radius": "0.625rem /* Spacing-2.5 10px */",
  "sidebar": "oklch(98.5% 0 0) /* zinc-50 */",
  "sidebar-foreground": "oklch(0.141 0.005 285.823) /* zinc-950 */",
  "sidebar-primary": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "sidebar-primary-foreground": "oklch(1 0 0) /* white */",
  "sidebar-accent": "oklch(96.7% 0.001 286.375) /* zinc-100 */",
  "sidebar-accent-foreground": "oklch(0.21 0.006 285.885) /* zinc-900 */",
  "sidebar-border": "oklch(92% 0.004 286.32) /* zinc-200 */",
  "sidebar-ring": "oklch(62.3% 0.214 259.815) /* blue-500 */"
},
"dark": {
  "background": "oklch(14.5% 0 none) /* neutral-950 */",
  "foreground": "oklch(98.5% 0 none) /* zinc-50 */",
  "card": "oklch(20.5% 0 none) /* neutral-900 */",
  "card-foreground": "oklch(98.5% 0 none) /* neutral-50 */",
  "popover": "oklch(20.5% 0 none) /* neutral-900 */",
  "popover-foreground": "oklch(98.5% 0 none) /* neutral-50 */",
  "primary": "oklch(48.8% 0.243 264.376) /* blue-700 */",
  "primary-foreground": "oklch(97% 0.014 254.604) /* blue-50 */",
  "secondary": "oklch(27.4% 0.006 286.033) /* zinc-800 */",
  "secondary-foreground": "oklch(98.5% 0 none) /* neutral-50 */",
  "muted": "oklch(26.9% 0 none) /* neutral-800 */",
  "muted-foreground": "oklch(70.8% 0 none) /* neutral-400 */",
  "accent": "oklch(26.9% 0 none) /* neutral-800 */",
  "accent-foreground": "oklch(98.5% 0 none) /* neutral-50 */",
  "destructive": "oklch(70.4% 0.191 22.216) /* red-400 */",
  "border": "oklch(1 0 0 / 10%) /* white / 10% */",
  "input": "oklch(1 0 0 / 15%) /* white / 15% */",
  "ring": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "chart-1": "oklch(80.9% 0.105 251.813) /* blue-300 */",
  "chart-2": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "chart-3": "oklch(54.6% 0.245 262.881) /* blue-600 */",
  "chart-4": "oklch(48.8% 0.243 264.376) /* blue-700 */",
  "chart-5": "oklch(42.4% 0.199 265.638) /* blue-800 */",
  "sidebar": "oklch(20.5% 0 none) /* neutral-900 */",
  "sidebar-foreground": "oklch(98.5% 0 none) /* neutral-50 */",
  "sidebar-primary": "oklch(62.3% 0.214 259.815) /* blue-500 */",
  "sidebar-primary-foreground": "oklch(97% 0.014 254.604) /* blue-50 */",
  "sidebar-accent": "oklch(26.9% 0 none) /* neutral-800 */",
  "sidebar-accent-foreground": "oklch(98.5% 0 none) /* neutral-50 */",
  "sidebar-border": "oklch(1 0 0 / 10%) /* white / 10% */",
  "sidebar-ring": "oklch(62.3% 0.214 259.815) /* blue-500 */"
}
```

- [ ] **Step 3: Run the parity test and inspect remaining failures**

```bash
bun test scripts/theme-registry.test.ts
```

Expected: the globals/registry parity test passes. Documentation assertions
still fail until Task 3. The shadcn installation assertion should pass because
the registry values now carry comments.

- [ ] **Step 4: Commit the synchronized theme payload**

```bash
git add app/globals.css registry.json
git commit -m "fix(theme): Synchronize registry color tokens"
```

---

### Task 3: Synchronize bilingual chart documentation

**Files:**

- Modify: `content/docs/components/chart.mdx:191-210`
- Modify: `content/docs/components/chart.mdx:700-713`
- Modify: `content/docs/components/chart.ko.mdx:191-210`
- Modify: `content/docs/components/chart.ko.mdx:700-713`
- Test: `scripts/theme-registry.test.ts`

**Interfaces:**

- Consumes: registry chart values with trailing comments removed.
- Produces: CSS snippets that users can paste directly into `app/globals.css`.

- [ ] **Step 1: Update the full installation examples in both locales**

Use this palette in both full CSS blocks:

```css
:root {
  --chart-1: oklch(80.9% 0.105 251.813);
  --chart-2: oklch(62.3% 0.214 259.815);
  --chart-3: oklch(54.6% 0.245 262.881);
  --chart-4: oklch(48.8% 0.243 264.376);
  --chart-5: oklch(42.4% 0.199 265.638);
}

.dark {
  --chart-1: oklch(80.9% 0.105 251.813);
  --chart-2: oklch(62.3% 0.214 259.815);
  --chart-3: oklch(54.6% 0.245 262.881);
  --chart-4: oklch(48.8% 0.243 264.376);
  --chart-5: oklch(42.4% 0.199 265.638);
}
```

- [ ] **Step 2: Update the smaller theming examples in both locales**

Use the same values for light and dark in the two-token examples:

```css
:root {
  --chart-1: oklch(80.9% 0.105 251.813);
  --chart-2: oklch(62.3% 0.214 259.815);
}

.dark {
  --chart-1: oklch(80.9% 0.105 251.813);
  --chart-2: oklch(62.3% 0.214 259.815);
}
```

- [ ] **Step 3: Run the focused tests and confirm GREEN**

```bash
bun test scripts/theme-registry.test.ts
```

Expected: all theme registry tests PASS, including the local shadcn install.

- [ ] **Step 4: Commit the documentation synchronization**

```bash
git add content/docs/components/chart.mdx content/docs/components/chart.ko.mdx
git commit -m "docs(chart): Update theme color examples"
```

---

### Task 4: Regenerate and verify the release artifacts

**Files:**

- Verify: `public/r/theme.json`
- Verify: `public/r/registry.json`
- Verify: all tracked changes from Tasks 1-3

**Interfaces:**

- Consumes: the final `registry.json` and MDX sources.
- Produces: a validated static registry and site build without tracked generated files.

- [ ] **Step 1: Generate the registry artifacts**

```bash
bun run registry:build
```

Expected: command exits `0` and rewrites ignored `public/r/theme.json` and
`public/r/registry.json`.

- [ ] **Step 2: Assert generated values retain comments**

```bash
rg -n 'blue-500|Spacing-2.5 10px|neutral-950' public/r/theme.json public/r/registry.json
```

Expected: both generated files contain the comment-bearing JSON strings.

- [ ] **Step 3: Run focused and project-wide static checks**

```bash
bun test scripts/theme-registry.test.ts
bun run typecheck
bun run lint
```

Expected: all commands exit `0` with no test failures, type errors, or lint errors.

- [ ] **Step 4: Run the complete build**

```bash
bun run build
```

Expected: registry generation, Next build, static export finalization, and
export verification all complete successfully.

- [ ] **Step 5: Review the final diff and repository state**

```bash
git diff --check
git status --short
git log --oneline -5
```

Expected: no whitespace errors; only the intended tracked files are changed or
committed; ignored `public/r` artifacts do not appear in status.

- [ ] **Step 6: Commit any test-only adjustment required by real CLI behavior**

Only if the end-to-end test required a harness correction that did not weaken
the assertions:

```bash
git add scripts/theme-registry.test.ts
git commit -m "test: Stabilize theme registry installation coverage"
```
