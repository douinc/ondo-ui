# Ondo Registry

Use this reference when authoring, changing, or debugging Ondo registry items.

## Source and built forms

- The source registry is the repository root `registry.json`. Its `files[].path` values point to source files in this repository.
- `bun run registry:build` builds installable item payloads into `public/r/` and the registry index at `public/r/registry.json`.
- Consumers install the built payload through `https://ui.ondo.dou.so/r/{name}.json` or the configured `@ondo-ui` namespace.

Common Ondo item types:

| Type | Purpose and target |
| --- | --- |
| `registry:ui` | Reusable UI source installed into the configured UI alias. |
| `registry:component` | Higher-level source such as `components/compositions/*` or `components/theme-provider.tsx`. |
| `registry:lib` | Utilities installed through the configured library or utils alias. |
| `registry:hook` | Hooks installed through the configured hooks alias. |
| `registry:theme` | CSS variables, fonts, and dependencies merged into the project theme. |

Use `dependencies` for npm packages and `registryDependencies` for installable registry items. Keep file paths copyable and include every import the installed source requires.

## Namespace invariant

Every dependency owned by Ondo must use `@ondo-ui/<name>`. Bare names resolve to official shadcn items, not sibling Ondo items.

```json
{
  "name": "number-badge",
  "type": "registry:component",
  "registryDependencies": [
    "@ondo-ui/utils",
    "@ondo-ui/badge",
    "@ondo-ui/number-count"
  ]
}
```

Use explicit addresses for every source:

- `@ondo-ui/button` — Ondo namespace.
- `@acme/button` — another configured namespace.
- `owner/repo/button` — public GitHub source registry.
- `https://example.com/r/button.json` — built payload URL.
- `./button.json` — local built payload.

Do not use a bare Ondo dependency such as `"button"`; that silently resolves against the official registry.

## Maintainer workflow

Before adding, renaming, removing, or registering anything under `components/ui/`, read [`.claude/skills/add-component/SKILL.md`](../../.claude/skills/add-component/SKILL.md). It defines the seven registration points for components, demos, bilingual docs, navigation, the gallery, and the registry.

Verify one item or the complete registry:

```bash
python3 .claude/skills/add-component/scripts/check-registration.py <name>
python3 .claude/skills/add-component/scripts/check-registration.py
npm run build
```

Use the checker before the build because missing registration points otherwise fail silently. The build verifies MDX compilation, registry payload generation, and static export behavior.

