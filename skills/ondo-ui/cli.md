# Ondo UI CLI

Use `bunx --bun @dou.so/ondo-ui@latest` for every command. The Ondo CLI owns framework initialization, Ondo item selection, and Ondo documentation links; it delegates the remaining command surface to `shadcn@latest`.

## Ondo-owned commands

### Initialize

```bash
bunx --bun @dou.so/ondo-ui@latest init -t astro
```

Supported templates are `next`, `vite`, `start`, `react-router`, `laravel`, and `astro`. Initialization installs the compatible theme items and adds this registry mapping to every generated `components.json`:

```json
{
  "registries": {
    "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
  }
}
```

For Laravel, create the Laravel application first and run Ondo initialization inside it. Use `--cwd` when the target project is not the current directory:

```bash
bunx --bun @dou.so/ondo-ui@latest init -t vite --cwd ../my-app
```

### Add

Open the grouped Components and Compositions selector:

```bash
bunx --bun @dou.so/ondo-ui@latest add
```

Install explicit items or all selectable items:

```bash
bunx --bun @dou.so/ondo-ui@latest add button empty-view
bunx --bun @dou.so/ondo-ui@latest add --all
```

Bare names become `@ondo-ui/<name>`. Namespaced addresses, URLs, local JSON paths, and GitHub registry addresses pass through unchanged. The interactive menu and `--all` include `registry:ui` Components and `registry:component` Compositions under `components/compositions/`; they exclude system items such as `theme`, `theme-provider`, `utils`, and `use-mobile`. Install a system item by explicit name when needed.

Preview changes before updating installed source:

```bash
bunx --bun @dou.so/ondo-ui@latest add button --dry-run
bunx --bun @dou.so/ondo-ui@latest add button --diff
bunx --bun @dou.so/ondo-ui@latest add button --view
```

Use `--diff <path>` or `--view <path>` to focus on one generated file. Review the result, preserve intentional local changes, and then run `add` without a preview flag.

### Docs

Resolve Ondo website and registry payload links:

```bash
bunx --bun @dou.so/ondo-ui@latest docs button --json
```

Bare names and `@ondo-ui/<name>` resolve from the Ondo registry. Components link to `/docs/components/<name>`, Compositions to `/docs/compositions/<name>`, and theme items to `/docs/theming`. Registry-only items return their `/r/<name>.json` link. External namespaces, URLs, local paths, and GitHub addresses delegate to shadcn. Run Ondo and external documentation requests separately.

## Delegated commands

Search and inspect the configured Ondo registry:

```bash
bunx --bun @dou.so/ondo-ui@latest search @ondo-ui --query button
bunx --bun @dou.so/ondo-ui@latest view @ondo-ui/button
bunx --bun @dou.so/ondo-ui@latest info --json
```

`search`, `view`, `info`, `apply`, `migrate`, `eject`, `mcp`, `preset`, `build`, and `registry` use shadcn's implementation. `list` aliases `search`; `diff` aliases `add --diff`. `apply` and `preset` are shadcn features and do not define an Ondo preset format.

Most delegated project commands accept `--cwd <path>`. Use `info --json --cwd <path>` first when operating outside the current project.
