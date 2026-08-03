# Ondo CLI Init Design

## Goal

Provide a public `@dou.so/ondo-ui init` command that scaffolds a supported framework with
Ondo's theme assets, optional framework-compatible theme provider, and the
`@ondo-ui` registry already configured.

## Reference implementation

The implementation follows the shadcn CLI in `/Users/initred/Code/ui`. Its
`init` command accepts registry item URLs as positional components and installs
them during project initialization. Ondo will use that supported interface
instead of modifying or vendoring shadcn internals.

## User experience

```bash
npx @dou.so/ondo-ui@latest init -t next
```

The command delegates supported shadcn options such as `--cwd`, `--name`,
`--monorepo`, `--base`, `--preset`, and `--yes`. After initialization,
`components.json` contains:

```json
{
  "registries": {
    "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
  }
}
```

## Framework behavior

| Framework | shadcn template | Initial registry items |
| --- | --- | --- |
| Next.js | `next` | `theme`, `theme-provider` |
| Vite | `vite` | `theme`, `theme-provider` |
| TanStack Start | `start` | `theme`, `theme-provider` |
| React Router | `react-router` | `theme`, `theme-provider` |
| Laravel | existing Laravel project, no template flag | `theme`, `theme-provider` |
| Astro | `astro` | `theme` |

The wrapper passes these as direct URLs to `shadcn init`, then merges the Ondo
namespace without removing user-defined registries.

Laravel starters may include a single-package `pnpm-workspace.yaml`. The
wrapper enables pnpm's workspace-root dependency installation guard only for
the Laravel child process so shadcn can install dependencies in the Laravel
app root.

## Package shape

The repository package becomes publishable as `ondo-ui` and exposes a single
`bin/ondo-ui.mjs` executable. The npm package includes only the package
manifest and CLI file, keeping the documentation application out of the
published CLI artifact.

## Error handling

- Reject unsupported framework values before invoking shadcn.
- Preserve shadcn's exit code and output when initialization fails.
- Fail with a clear message if `components.json` cannot be found or parsed
  after shadcn completes.
- Do not overwrite existing registry namespaces; update only `@ondo-ui`.

## Testing

- Unit-test framework item selection and `components.json` registry merging.
- Unit-test command argument construction, including Laravel's omitted
  template flag and Astro's provider exclusion.
- Run the CLI against temporary Next and Astro projects and verify installed
  files, dependencies, CSS changes, and registry configuration.
- Run the repository typecheck, lint, tests, and production build.
