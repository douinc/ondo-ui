# Ondo UI through the shadcn MCP Server

Ondo uses the shadcn MCP server; it does not implement a separate MCP protocol. The server reads the project's `components.json`, so ensure it contains:

```json
{
  "registries": {
    "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
  }
}
```

## Client setup

```bash
bunx --bun @dou.so/ondo-ui@latest mcp init --client claude
bunx --bun @dou.so/ondo-ui@latest mcp init --client cursor
bunx --bun @dou.so/ondo-ui@latest mcp init --client vscode
bunx --bun @dou.so/ondo-ui@latest mcp init --client opencode
```

Codex uses manual configuration in `~/.codex/config.toml`:

```toml
[mcp_servers.shadcn]
command = "bunx"
args = ["--bun", "@dou.so/ondo-ui@latest", "mcp"]
```

Restart the client after configuration.

## Tool purposes

| MCP tool | Use |
| --- | --- |
| `shadcn:get_project_registries` | List namespaces configured in `components.json`. |
| `shadcn:list_items_in_registries` | Browse items and filter by registry item type. |
| `shadcn:search_items_in_registries` | Fuzzy-search `@ondo-ui` for a product need. |
| `shadcn:view_items_in_registries` | Inspect registry metadata and source files. |
| `shadcn:get_item_examples_from_registries` | Find relevant demos and usage source. |
| `shadcn:get_add_command_for_items` | Generate the install command for selected addresses. |
| `shadcn:get_audit_checklist` | Review imports, dependencies, lint, and TypeScript after installation. |

Use explicit Ondo addresses in prompts:

- “List form components from `@ondo-ui` and show the best match for profile editing.”
- “View `@ondo-ui/empty-view` and its examples before adding it.”
- “Generate the add command for `@ondo-ui/alert-dialog`.”

Registry items include namespaced dependencies, so adding `@ondo-ui/alert-dialog` also resolves `@ondo-ui/button` and `@ondo-ui/utils`.

MCP tools do not expose the complete project context. Run this separately for framework, RSC, aliases, Tailwind, global CSS, icon library, installed files, and registry mappings:

```bash
bunx --bun @dou.so/ondo-ui@latest info --json
```
