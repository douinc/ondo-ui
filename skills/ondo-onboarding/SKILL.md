---
name: ondo-onboarding
description: Sets up a complete Ondo UI environment end to end — scaffolding or reusing a project, installing every Component and Composition, the Ondo agent Skills, the Design Inspector, and MCP access for AI clients. Use this whenever the user wants to onboard, start, bootstrap, install, or set up Ondo UI (or "ondo") in a new or existing app, asks for the "full" Ondo UI experience or playground, or wants Ondo components plus Skills, Design Inspector, or MCP working together — even if they only name one of those pieces.
user-invocable: true
allowed-tools: Bash(bunx --bun @dou.so/ondo-ui@latest *), Bash(bunx skills *), Bash(bun add *)
---

# Ondo UI Onboarding

Turn a directory into a working Ondo UI environment in one pass: a configured
project, every Component and Composition, the Ondo agent Skills, the Design
Inspector, and MCP access for the user's AI clients — verified at the end.

Ask everything in a single round up front, then run every step without further
questions. Onboarding should feel like one decision, not twenty interruptions.

## 1. Detect before asking

Inspect the current directory first so the question round is short and its
defaults are accurate. Check for:

- `package.json` and `components.json` (existing project? already shadcn-initialized?)
- Lockfiles: `bun.lock`/`bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
- Framework markers: `next.config.*`, `vite.config.*`, `react-router.config.*`,
  `astro.config.*`, `artisan`, `@tanstack/react-start` in `package.json`
- Git status, if a repository — onboarding writes many files, so surface
  uncommitted changes in the location question rather than discovering the mess later

## 2. Ask everything once

Ask these in one round (use AskUserQuestion when available; otherwise one chat
message). If the user's request already answers a question, do not re-ask it.
If there is no way to ask (non-interactive run), use the stated answers plus
the defaults below and proceed.

1. **Location** — current folder or new folder (+ project name)?
   Default to the current folder when it already contains a project; mention
   what was detected (framework, lockfile, dirty git) in the option text.
2. **Framework** — `next` (default) | `vite` | `start` (TanStack Start) |
   `react-router` | `astro` | `laravel`. If a framework was detected, confirm
   it instead of offering all six.
3. **Package manager** — `bun` (default) | `pnpm` | `npm` | `yarn`.
   Default to the detected lockfile's manager for existing projects.
4. **MCP clients** — multi-select, `claude` and `codex` preselected;
   `cursor`, `vscode`, `opencode` optional. Note that codex config is written
   globally to `~/.codex/config.toml`, not into the project.

Everything else is deliberately not a question: all Components and
Compositions, all Skills, and the Design Inspector are always installed —
a complete environment is the point of onboarding.

After the answers, restate the plan as a short table, then execute steps 3–8
without pausing.

## Command forms

Every command must respect the chosen package manager, both because users
expect it and because the scaffolded lockfile follows the runner:

| Package manager | `<ondo>` (CLI runner)                  | `<add-dev>`      | `<skills>`        |
| --------------- | -------------------------------------- | ---------------- | ----------------- |
| bun             | `bunx --bun @dou.so/ondo-ui@latest`    | `bun add -D`     | `bunx skills`     |
| pnpm            | `pnpm dlx @dou.so/ondo-ui@latest`      | `pnpm add -D`    | `pnpm dlx skills` |
| npm             | `npx @dou.so/ondo-ui@latest`           | `npm install -D` | `npx skills`      |
| yarn            | `yarn dlx @dou.so/ondo-ui@latest`      | `yarn add -D`    | `yarn dlx skills` |

Before step 3, read `references/<framework>.md` for the chosen framework — it
carries the init nuances, the Design Inspector mount, and the verify commands.

## 3. Project setup

Pick the case that matches the answers:

- **New folder** — from the parent directory:
  `<ondo> init -t <framework> --name <project-name>`, then work inside the new
  folder. `--name` matters: without it the scaffolder waits on an interactive
  prompt, which looks like a freeze.
- **Empty current folder** — treat as a new project: run the same command from
  the parent with `--name <folder-basename>`.
- **Existing project, no `components.json`** — first make sure the framework
  prerequisites exist; each `references/<framework>.md` has an
  "Existing project prerequisites" section. In short: Tailwind v4 wired into
  the build and a working `@/*` import alias. shadcn's preflight validates
  both on existing projects and cannot create them — without them `init`
  fails with validation errors (and improvised workarounds tend to install
  Tailwind v3, which Ondo does not support). Then, at the project root:
  `<ondo> init -t <framework>`
- **Existing project with `components.json`** — do not re-init. Ensure
  `registries["@ondo-ui"] = "https://ui.ondo.dou.so/r/{name}.json"` in
  `components.json`, then `<ondo> add theme theme-provider`
  (`add theme` only for astro).
- **Laravel** — the app must exist before init; see `references/laravel.md`.

`init` delegates to shadcn (auto-appending `--yes` and `--no-monorepo`),
installs the framework-compatible theme, and injects the `@ondo-ui` registry
mapping into every `components.json` it finds. Confirm the mapping exists
before moving on — every later step depends on it.

## 4. Install every Component and Composition

```bash
<ondo> add --all
```

`--all` installs every menu-visible Component and Composition and resolves
npm and registry dependencies automatically; `theme` and `theme-provider` are
system items already handled by init.

The overwrite policy depends on who wrote the files already in the project:

- **Fresh scaffold from step 3** — run `add --all --yes --overwrite`. The
  framework templates ship stock shadcn components (the Next.js template
  includes a Radix-based `button.tsx`, for example). Nothing in the project
  is user-authored yet, and keeping stock files breaks typechecking: Ondo
  components such as `pagination` and `combobox` expect Ondo Button's
  variants, not the stock ones.
- **Existing project** — append `--yes` so file-conflict confirmations cannot
  stall the run, but never pass `--overwrite`: components the user authored
  win. List any skipped files in the final report and point at
  `<ondo> diff <item>` for reconciling them.

## 5. Install the Ondo Skills

From the project root:

```bash
<skills> add douinc/ondo-ui -s ondo-ui -s ondo-onboarding -a <agents> -y
```

Name the consumer Skills explicitly (`-s` repeats once per skill) — never
`--skill '*'`: the repository also carries internal development skills, such
as `add-component`, and the wildcard installs them even though they are
marked `metadata.internal: true` (the flag only filters normal discovery,
not `--skill '*'`). If the installer
rejects a name as unknown (an older copy of the repository), retry with only
the consumer Skills it does offer — internal ones such as `add-component`
stay out even if listed — and never abort the onboarding over this step.
Derive `<agents>` from the chosen MCP clients:

| MCP client | skills agent     |
| ---------- | ---------------- |
| claude     | `claude-code`    |
| codex      | `codex`          |
| cursor     | `cursor`         |
| vscode     | `github-copilot` |
| opencode   | `opencode`       |

## 6. Install the Design Inspector

```bash
<add-dev> @dou.so/design-inspector
```

The Design Inspector is an npm package on purpose — it is a development tool,
so its code stays in `node_modules` instead of being copied into the project.
Follow the mount snippet in `references/<framework>.md`: create the mount
file, import `@dou.so/design-inspector/styles.css`, and keep the dev-only
guard so nothing mounts — or downloads — in production.

## 7. Configure MCP

For each selected client:

```bash
<ondo> mcp init --client <client>
```

This wires the shadcn MCP server, which discovers `@ondo-ui` items through the
registry mapping written in step 3. Config lands per client: claude →
`.mcp.json`, cursor → `.cursor/mcp.json`, vscode → `.vscode/mcp.json`,
opencode → `opencode.json`, codex → `~/.codex/config.toml` (global — say so
in the report).

## 8. Verify, then report

Verification is part of onboarding — a setup that was never exercised is a
setup that fails on first use:

1. `<ondo> info --json` — confirm framework, aliases, and the `@ondo-ui`
   registry mapping.
2. Count installed files in `components/ui/` and `components/compositions/`.
3. Typecheck with the project's own script when one exists, otherwise the
   verify command in the framework reference. This is what catches a broken
   Design Inspector mount immediately.

ALWAYS end with this report:

```markdown
## Ondo UI onboarding complete

| Step             | Result                                          |
| ---------------- | ----------------------------------------------- |
| Project          | <new/existing>, <framework>, <package manager>  |
| Components       | <N> in components/ui, <M> Compositions          |
| Skills           | <skill names> → <agent directories>             |
| Design Inspector | mounted in <file> (development only)            |
| MCP              | <clients and config paths>                      |
| Verify           | <typecheck/build result>                        |

Next steps:
- Restart <clients> to pick up the MCP server, then try:
  "Show me the components in the ondo-ui registry"
- Run `<pm> run dev` and press Shift twice to open the Design Inspector
- Docs: https://ui.ondo.dou.so
```

If any step failed, add a **Needs attention** section listing each failure
with the exact command to retry.

## Guardrails

- **Never start a command that can wait on a TTY prompt.** Carry the
  non-interactive flags everywhere: `--name`, `--all`, `--yes`, `-y`,
  `--client`, `--no-interaction`. A hung prompt is indistinguishable from a
  freeze to the user.
- **A failed step does not abort onboarding.** Retry network failures once,
  then continue with the remaining steps and collect failures for the report.
- **Touch nothing outside the project** except the configs the user opted
  into (the global codex file).
- **Keep the user's files.** `--overwrite` exists to replace template stock
  files on a fresh scaffold — never use it where it could rewrite components
  the user customized.
- **Never patch registry component source to silence type errors.** If
  typecheck fails inside `components/ui` right after installing, the cause is
  almost always a stock/Ondo mix (a template-shipped component that was not
  replaced). Reinstall the affected items from `@ondo-ui` with `--overwrite`;
  hand-editing them leaves a component that looks right but drifts from the
  registry.
