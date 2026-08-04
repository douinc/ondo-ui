# Ondo UI Skill Design

## Goal

Add a repository-hosted `ondo-ui` AI skill modeled after the official
shadcn/ui skill, while keeping its instructions, examples, and command flow
specific to Ondo UI.

The supported installation experience is:

```bash
npx skills add douinc/ondo-ui
```

The skill must teach compatible AI assistants how to inspect an existing
project, discover and install Ondo registry items, compose components using
Base UI APIs, follow Ondo styling conventions, find Ondo documentation, and
use the shadcn MCP server with the `@ondo-ui` registry.

## Distribution decision

The skill is distributed from the GitHub repository, matching the official
`shadcn-ui/ui` repository:

- Source files live under `skills/ondo-ui/` at the repository root.
- The skills installer reads the default branch of `douinc/ondo-ui`.
- `skills/ondo-ui/**` is not added to the `@dou.so/ondo-ui` npm package's
  `files` list.
- Changes to skill prose and evaluations do not require an npm package
  release.
- The website documents the GitHub installation command.

The first release does not add `.cursor-plugin/plugin.json`. Cursor can use
the installed skill and the existing shadcn MCP configuration without an
Ondo-specific marketplace plugin. A plugin manifest can be added later as a
separate feature if Ondo is submitted to a plugin marketplace.

## Scope

The feature has three deliverables:

1. A self-contained GitHub skill under `skills/ondo-ui/`.
2. English and Korean website documentation explaining installation and use.
3. Ondo-aware `docs` CLI behavior so the skill can resolve Ondo component and
   Composition documentation instead of failing in the official shadcn docs
   index.

The existing `info --json`, `search`, `view`, `add`, and `mcp` commands remain
thin shadcn-backed commands. Current verification shows that
`ondo-ui info --json` already returns framework, Tailwind, Base UI, aliases,
resolved paths, installed components, icon library, and the configured
`@ondo-ui` registry. It does not need a new output contract for this feature.

## Non-goals

- Do not copy the complete official shadcn skill verbatim.
- Do not support Radix UI or React Aria APIs in the Ondo skill.
- Do not add the official `migrate-radix-to-base` skill.
- Do not add an Ondo preset encoder, decoder, or visual preset builder.
- Do not reimplement shadcn registry resolution, project inspection, MCP, or
  file installation.
- Do not add the skill files to the npm tarball.
- Do not add a Cursor marketplace plugin in the initial release.
- Do not document Tailwind v3 as supported unless a separate compatibility
  decision and test matrix is added.

## Repository layout

Create the following tree:

```text
skills/
└── ondo-ui/
    ├── SKILL.md
    ├── cli.md
    ├── customization.md
    ├── mcp.md
    ├── registry.md
    ├── agents/
    │   └── openai.yml
    ├── assets/
    │   ├── ondo-small.png
    │   └── ondo.png
    ├── evals/
    │   └── evals.json
    └── rules/
        ├── base-ui.md
        ├── chat.md
        ├── composition.md
        ├── forms.md
        ├── icons.md
        └── styling.md
```

The skill folder is self-contained. Relative links and icon paths must not
escape `skills/ondo-ui/`, because GitHub skill installers may copy only the
selected skill directory.

Reuse the existing Ondo application icons as the source for the two PNG
assets, but copy them into the skill folder so the installed metadata remains
valid outside this repository.

## Main skill contract

`skills/ondo-ui/SKILL.md` uses this frontmatter shape:

```yaml
---
name: ondo-ui
description: Manages Ondo UI projects and registry items — initializing supported frameworks, adding and searching components and Compositions, composing Base UI interfaces, applying Ondo styling rules, and configuring MCP access.
user-invocable: false
allowed-tools: Bash(bunx --bun @dou.so/ondo-ui@latest *)
---
```

The main skill injects project context with:

```bash
bunx --bun @dou.so/ondo-ui@latest info --json
```

It must tell the assistant to use the project's values instead of assuming:

- framework and RSC behavior;
- aliases and resolved paths;
- Tailwind version and global CSS path;
- configured icon library;
- installed component files;
- the `@ondo-ui` registry mapping.

The main workflow is:

1. Read project context with `info --json`.
2. Confirm `@ondo-ui` exists in `components.json`; use Ondo `init` when the
   project still needs framework setup.
3. Check installed files before adding or importing an item.
4. Search `@ondo-ui` before authoring custom UI.
5. Run `docs` and `view` for the selected item before composing it.
6. Use `add --dry-run` and `add --diff` before updating existing files.
7. Install with the Ondo CLI and review generated source.
8. Follow the Base UI, styling, form, icon, composition, and chat rules.

Bare item names passed to the Ondo CLI mean Ondo items. Explicit third-party
addresses and URLs remain allowed, but the assistant must not choose an
external registry unless the user asks for it.

## Ondo-specific rules

### Base UI

Ondo is Base UI only. The skill must teach:

- `render` instead of Radix `asChild` for polymorphic composition;
- `nativeButton={false}` when a button-like component renders a non-button;
- Base UI `Select` item arrays and placeholder behavior;
- Base UI `ToggleGroup` array values and `multiple` prop;
- scalar single-thumb values for Base UI `Slider`;
- required accessible titles for Dialog, Sheet, Drawer, and AlertDialog.

No Radix or React Aria alternative examples belong in the initial skill.

### Styling and theme

The skill must preserve Ondo's semantic visual system:

- use semantic classes such as `bg-background`, `text-foreground`,
  `bg-surface`, `text-muted-foreground`, `text-info`, `text-success`,
  `text-warning`, and `text-destructive`;
- avoid raw palette colors for product states when a semantic token exists;
- avoid manual light/dark color pairs when a semantic token expresses the
  intended state;
- use `gap-*` for layout spacing and `size-*` for equal width and height;
- use `cn()` for conditional classes;
- use Pretendard for sans text and Monaspace Neon for code through the theme,
  not direct font declarations;
- edit the `tailwindCssFile` reported by `info --json` rather than creating a
  second global stylesheet.

The customization reference documents Ondo's `info`, `success`, `warning`,
`surface`, and code tokens in addition to the standard shadcn semantic tokens.

### Components and Compositions

The skill distinguishes registry categories:

- Components are `registry:ui` items installed into the configured UI alias.
- Compositions are `registry:component` items with files under
  `components/compositions/`.
- System items include `theme`, `theme-provider`, `utils`, and `use-mobile`.

The default `add` menu and `add --all` include Components and Compositions but
exclude system items. System items remain installable explicitly and are
installed by framework initialization where required.

The Composition rules must prefer `empty-view` and `number-badge` when their
use cases match, while still explaining when to compose the lower-level
`Empty`, `Badge`, and `NumberCount` components directly.

### Registry authoring

The registry reference must include the Ondo invariant:

```json
{
  "registryDependencies": [
    "@ondo-ui/button",
    "@ondo-ui/utils"
  ]
}
```

Bare registry dependencies refer to official shadcn items. Every dependency
that belongs to the Ondo registry must use `@ondo-ui/<name>`. The document
must point maintainers to `.claude/skills/add-component/SKILL.md` for the
seven Ondo registration points and checker command instead of duplicating the
full maintainer workflow.

### Chat

Chat guidance must use Ondo's existing `MessageScroller`, `Message`, `Bubble`,
`Attachment`, and `Marker` components. It must prohibit hand-written
stick-to-bottom logic when `MessageScroller` already provides streaming,
anchoring, and jump-to-latest behavior.

## CLI reference inside the skill

`skills/ondo-ui/cli.md` documents the Ondo-owned behavior separately from the
commands delegated to shadcn.

Ondo-owned behavior:

- framework-aware `init` for Next.js, Vite, TanStack Start, React Router,
  Laravel, and Astro;
- `@ondo-ui` registration in generated `components.json` files;
- grouped `add` menu and bare-name normalization;
- `add --all` across Components and Compositions;
- Ondo-aware `docs` links.

Delegated behavior:

- `search`, `list`, `view`, `info`, `apply`, `migrate`, `eject`, `mcp`,
  `preset`, `build`, and `registry` continue to use shadcn's implementation;
- `diff` remains the Ondo compatibility alias for `add --diff`.

The skill must not claim that Ondo has its own preset code format or registry
installer implementation.

## Ondo-aware docs command

The official shadcn `docs` command reads the official shadcn registry index,
so it currently fails for `@ondo-ui/button`. Add a focused Ondo docs resolver
without changing the rest of the delegated CLI architecture.

Create `packages/ondo-ui-cli/bin/ondo-docs.mjs` with pure helpers and an
injectable registry fetch boundary. It resolves bare names and
`@ondo-ui/<name>` addresses from the Ondo registry index.

Result shape for `--json`:

```json
{
  "registry": "@ondo-ui",
  "base": "base",
  "results": [
    {
      "component": "button",
      "category": "component",
      "links": {
        "docs": "https://ui.ondo.dou.so/docs/components/button",
        "registry": "https://ui.ondo.dou.so/r/button.json"
      }
    }
  ]
}
```

Documentation URL rules:

- `registry:ui` maps to `/docs/components/<name>`.
- a `registry:component` file under `components/compositions/` maps to
  `/docs/compositions/<name>`.
- `theme` and `theme-provider` map to `/docs/theming`.
- items without a website page still return the registry payload URL and a
  clear warning in text mode; their JSON result omits `links.docs`.

Unknown Ondo items produce a concise non-zero error. External namespaces,
URLs, local paths, and GitHub addresses continue to delegate to shadcn docs.
Mixing Ondo and external addresses in one invocation is rejected with a clear
message directing the caller to run separate commands; this keeps text and
JSON output deterministic.

This CLI correction changes published package behavior and requires a patch
Changeset. The skill files themselves remain outside the npm package.

## MCP reference

The MCP reference documents that Ondo uses the shadcn MCP server rather than a
separate protocol implementation. It includes:

- the required `@ondo-ui` entry in `components.json`;
- `ondo-ui mcp init --client` examples for Claude Code, Cursor, VS Code, and
  OpenCode;
- the manual Codex configuration;
- the shadcn MCP registry tools relevant to search, view, examples, and add
  commands;
- prompts that explicitly name `@ondo-ui`.

The MCP text must use namespaced Ondo dependency examples after the registry
dependency correction.

## Website documentation

Create:

- `content/docs/skills.mdx`
- `content/docs/skills.ko.mdx`

Register `skills` in `content/docs/meta.json` and `content/docs/meta.ko.json`
under the general documentation section near CLI and MCP.

Both pages include:

- what the Ondo skill provides;
- `npx skills add douinc/ondo-ui` installation;
- supported project context;
- included CLI, theming, registry, MCP, and composition knowledge;
- how project detection and context injection work;
- example prompts for forms, dashboards, Compositions, and chat;
- links to Installation, CLI, MCP, Theming, Components, and Compositions.

Update the English and Korean root READMEs, CLI package READMEs, and docs
introduction to link to the Skills page. The npm package README may advertise
the GitHub installation command, but the npm tarball still must not contain
the skill directory.

## Agent metadata and evaluations

`agents/openai.yml` provides an Ondo display name, concise description, and
relative PNG icon paths.

`evals/evals.json` contains at least five Ondo-specific scenarios:

1. A profile form using `FieldGroup`, `Field`, semantic validation, and Ondo
   inputs.
2. A Base UI Dialog using `render`, an accessible title, Avatar fallback, and
   the configured icon library.
3. A dashboard using complete Card composition, Badge or NumberBadge,
   NumberCount, Skeleton, and semantic state colors.
4. An empty state that selects `EmptyView` instead of rebuilding it.
5. A streaming chat using MessageScroller, Message, Bubble, Attachment, and
   Marker without custom scrolling code.

Expected outputs must assert Ondo-specific component selection and must not
require Radix APIs.

## Validation and testing

Add a Bun test for the skill contract. The test must verify:

- every required skill file exists;
- all relative Markdown links in `SKILL.md` resolve inside
  `skills/ondo-ui/`;
- frontmatter declares `name: ondo-ui` and the Ondo CLI allowed tool;
- the dynamic context command uses `ondo-ui info --json`;
- rules do not prescribe `asChild` or Radix APIs;
- `evals/evals.json` parses and contains at least five uniquely identified
  evaluations;
- English and Korean docs metadata register the Skills page;
- `packages/ondo-ui-cli/package.json` does not include `skills/` in `files`.

Add focused CLI tests for:

- component, Composition, theming, and registry-only docs links;
- bare-name and `@ondo-ui/` normalization;
- `--json` output;
- unknown items;
- external address delegation;
- mixed Ondo/external rejection;
- existing command dispatch behavior remaining green.

Verification gates:

```bash
bun test scripts/ondo-skill.test.ts scripts/ondo-cli.test.ts
bun test
bun run typecheck
bun run lint
bun run build
```

Run an npm pack dry-run from `packages/ondo-ui-cli` and assert that no
`skills/` files enter the tarball. Before documenting the installer as
verified, run the skills CLI against the local repository if supported; after
merge, run `npx skills add douinc/ondo-ui` in a disposable directory and
confirm the installed folder contains `SKILL.md`, references, metadata,
assets, and evaluations.

## Release behavior

- Skill and website documentation changes are GitHub/Pages changes and do not
  require npm publication by themselves.
- The Ondo-aware `docs` correction changes CLI behavior, so add a patch
  Changeset for `@dou.so/ondo-ui`.
- Do not manually edit the package version. The existing Changesets workflow
  creates the Version Packages PR and publishes after that PR is merged.
- The feature PR must pass `Build static export` before merge.

## Success criteria

The feature is complete when:

1. The repository contains a self-contained Ondo skill modeled on the
   official shadcn structure.
2. The skill contains only Base UI and Ondo-specific rules.
3. `ondo-ui info --json` supplies project context used by the skill.
4. `ondo-ui docs button` and `ondo-ui docs empty-view` return valid Ondo docs
   and registry URLs.
5. English and Korean Skills pages are visible in the documentation menu.
6. The root and npm READMEs link to the Skills page and install command.
7. Skill tests, CLI tests, lint, typecheck, build, and package-content checks
   pass.
8. The skill remains outside the npm tarball and is installable from the
   GitHub repository.
