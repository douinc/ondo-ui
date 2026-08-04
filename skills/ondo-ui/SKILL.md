---
name: ondo-ui
description: Manages Ondo UI projects and registry items — initializing supported frameworks, adding and searching components and Compositions, composing Base UI interfaces, applying Ondo styling rules, and configuring MCP access.
user-invocable: false
allowed-tools: Bash(bunx --bun @dou.so/ondo-ui@latest *)
---

# Ondo UI

Build and maintain interfaces with Ondo UI. Treat the installed project configuration and registry metadata as the source of truth.

## Current Project Context

```json
!`bunx --bun @dou.so/ondo-ui@latest info --json`
```

Use these values instead of assuming the framework, RSC mode, aliases, resolved paths, Tailwind version, global CSS file, icon library, installed files, or registry mappings.

## Workflow

1. Read the current project context. If the command cannot identify a project, locate the intended app and rerun it with `--cwd`.
2. Confirm `components.json` maps `@ondo-ui` to `https://ui.ondo.dou.so/r/{name}.json`. Use Ondo `init` when the project still needs framework setup.
3. Check the installed component files before adding or importing an item.
4. Search `@ondo-ui` before writing custom UI:

   ```bash
   bunx --bun @dou.so/ondo-ui@latest search @ondo-ui --query button
   ```

5. Inspect the selected item before composing it:

   ```bash
   bunx --bun @dou.so/ondo-ui@latest docs button --json
   bunx --bun @dou.so/ondo-ui@latest view @ondo-ui/button
   ```

6. Before updating an installed item, preview the generated changes:

   ```bash
   bunx --bun @dou.so/ondo-ui@latest add button --dry-run
   bunx --bun @dou.so/ondo-ui@latest add button --diff
   ```

7. Install through the Ondo CLI, then review the generated source before adapting it:

   ```bash
   bunx --bun @dou.so/ondo-ui@latest add button
   ```

8. Compose with Base UI APIs and preserve Ondo's semantic styling, form, icon, Composition, and chat conventions.

Bare item names passed to the Ondo CLI select Ondo items. Use an explicit namespace, URL, local path, or GitHub address only when the user requests another source.

## Guardrails

- Reuse registry items and existing installed source before creating replacements.
- Preserve accessible names and required titles for overlays and form controls.
- Use the configured icon library and semantic theme tokens from project context.
- Keep generated components owned by the application: inspect and edit their source rather than wrapping them in an opaque dependency.

## References

- Read [CLI](./cli.md) before initializing projects, installing or updating items, or using delegated commands.
- Read [Customization and theming](./customization.md) before changing tokens, fonts, dark mode, variants, or global CSS.
- Read [MCP](./mcp.md) before configuring an AI client or invoking shadcn registry tools.
- Read [Registry](./registry.md) before authoring or debugging registry items and dependencies.
