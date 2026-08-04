# Ondo CLI command surface

## Goal

Expose the project-facing shadcn CLI commands through the Ondo CLI while
adding Ondo-aware registry behavior. Continue to use the official shadcn CLI
for registry resolution and file updates instead of copying its implementation.

The supported user experience is:

```bash
# Interactive Ondo menu.
bunx --bun @dou.so/ondo-ui add

# Explicit items.
bunx --bun @dou.so/ondo-ui add button empty-view

# Preview or install all selectable Ondo items.
bunx --bun @dou.so/ondo-ui add button --dry-run
bunx --bun @dou.so/ondo-ui add --all
```

## Registry categories

The menu reads `https://ui.ondo.dou.so/r/registry.json` and categorizes items
without relying on `type` alone:

- `Components`: items with `type: registry:ui`.
- `Compositions`: items whose registry files include a path under
  `components/compositions/`. These currently include `empty-view` and
  `number-badge`; they are `registry:component` items in the registry.
- Internal/system items such as `theme`, `theme-provider`, `utils`, and
  `use-mobile` are not included in the default interactive menu. They remain
  installable by explicit item name and are still managed by the existing
  `init` flow where appropriate.

`--all` means all Components and Compositions, not internal/system items.

## Architecture

Extend the small CLI entrypoint with a command dispatcher. Keep runtime
dependencies minimal: adding the same `prompts` dependency used by the
official shadcn CLI is acceptable for the interactive menu. Keep the
command-specific logic in small pure helpers so it can be tested without a
network or an interactive terminal.

The public command surface is:

| Command | Ondo behavior |
| --- | --- |
| `init` | Existing framework-aware Ondo setup and registry registration. |
| `add` | Ondo Components/Compositions menu, explicit names, and shadcn delegation. |
| `search` / `list` | Search configured Ondo registries by default; preserve shadcn filters and JSON output. |
| `view` | View explicit `@ondo-ui/*` registry items. |
| `docs` | Forward compatible shadcn docs behavior; document that registry docs require item metadata. |
| `diff` | Compatibility alias that delegates to `add --diff`. |
| `apply` | Forward shadcn preset application. |
| `info` | Forward project inspection. |
| `migrate` | Forward shadcn migrations. |
| `eject` | Forward shadcn dependency/style ejection. |
| `mcp` | Forward MCP setup and configuration commands, with Ondo registry guidance. |
| `preset` | Forward preset decode/url/open/resolve operations. |
| `build` | Forward registry build operations for registry authors. |
| `registry` | Forward registry authoring subcommands and validation. |

Registry-authoring commands (`build` and `registry`) are exposed as thin
passthroughs for teams maintaining a registry. Ondo maintains its own
registry in the website repository and continues to use the local shadcn
tooling for its release build; the published wrapper does not reimplement
registry authoring.

Keep command-specific logic in small pure helpers:

- parse the command and shared options (`--cwd`, `--yes`, `--overwrite`,
  `--dry-run`, `--all`);
- classify registry items and create grouped menu choices;
- resolve selected item names to `@ondo-ui/<name>` addresses;
- invoke the installed project through the existing shadcn CLI delegation
  pattern.

The menu may use the same `prompts` dependency and selection conventions as
the official shadcn CLI. The published Ondo package should not copy shadcn's
registry resolver or file updater. It delegates selected addresses to
`shadcn add`, preserving shadcn support for dependencies, aliases, Tailwind,
workspace projects, overwrites, diffs, and dry runs.

The existing `init` command remains unchanged apart from shared process
helpers if extraction is needed.

## Command behavior

1. `ondo-ui add` fetches the Ondo registry index, displays grouped Components
   and Compositions, and exits cleanly when the user selects nothing.
2. `ondo-ui add <items...>` skips the menu and installs the explicit names.
   Names are converted to `@ondo-ui/<name>` unless the caller already passes a
   registry address.
3. `ondo-ui add --all` selects every menu-visible Component and Composition.
4. Existing shadcn flags supported by the wrapper are forwarded. `--cwd`
   controls both registry installation and the project working directory.
5. `search` with no registry argument uses the Ondo registry configured in the
   target project's `components.json`; `search @ondo-ui` explicitly scopes the
   result to Ondo.
6. Commands that need Ondo item addresses normalize bare names to the
   `@ondo-ui/` namespace. Commands that are project-only are forwarded without
   registry rewriting.
7. A registry fetch failure, malformed index, empty selection, unknown command,
   or non-zero shadcn exit produces a concise error and a non-zero exit status.

## Documentation

Update both package READMEs and both installation index pages to document:

- the explicit namespaced shadcn command;
- the Ondo CLI interactive menu;
- the Components and Compositions groups;
- the complete command list, including registry-authoring passthroughs;
- explicit item, `--all`, `--dry-run`, and `--cwd` examples;
- the fact that `init` installs framework setup while `add` installs registry
  items.

Add a Changeset marking `@dou.so/ondo-ui` as a minor release. The current
published version is `1.3.1`, so this feature is intended for `1.4.0`.

## Testing

Write tests before implementation for:

- command parsing and explicit-name normalization;
- dispatch and argument forwarding for every public project-facing command;
- Components vs Compositions classification, including the fact that
  `theme-provider` is not a Composition;
- `--all` selecting exactly the two menu categories;
- forwarding `--cwd`, dry-run, overwrite, and yes flags;
- search/view namespace behavior and build/registry passthrough handling;
- registry failure and empty-selection behavior;
- the existing package-manager symlink and init behavior remaining green.

Use injected registry/prompt/process boundaries for deterministic tests. Add a
package smoke test that verifies the packed CLI includes the new runtime
prompt dependency and no website dependencies.

## Release and verification

- Run focused CLI tests, then the full test, typecheck, lint, build, and
  `npm pack --dry-run` checks.
- Add the Changeset but do not manually bump `package.json`.
- After the feature PR merges, Changesets will create the release PR for
  `1.4.0`; npm publish remains controlled by the existing protected workflow.
