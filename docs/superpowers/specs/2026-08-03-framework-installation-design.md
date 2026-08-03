# Framework Installation Guides Design

## Goal

Make Ondo UI installation discoverable and actionable for the same seven
framework paths shown by shadcn/ui, while keeping the site compatible with its
GitHub Pages static export.

## Scope

The installation documentation will support these paths:

- Next.js
- Vite
- TanStack Start
- Laravel
- React Router
- Astro
- Manual

Every path will have English and Korean content. The root installation page
will provide a framework card grid and link to the detailed guides.

## Architecture

The root `content/docs/installation.mdx` page remains the canonical overview.
Framework-specific pages live under `content/docs/installation/` as ordinary
Fumadocs MDX pages. `content/docs/installation/meta.json` fixes their sidebar
order. This follows the repository's existing nested documentation pattern and
requires no new runtime route or UI component.

The existing catch-all docs routes already call `source.getPages(locale)` from
`generateStaticParams()`. With the existing Next configuration
(`output: "export"` and `trailingSlash: true`), each new page is emitted as a
static `index.html` directory, suitable for GitHub Pages.

## Content design

The overview page will:

1. Explain that Ondo UI is installed through the shadcn CLI.
2. Provide a short new-project command and an existing-project path.
3. Render seven `LinkedCard` cards linking to the framework guides.
4. Preserve the existing registry URL and first-component example.

Each framework page will contain:

1. A framework-specific new-project command.
2. An existing-project setup path.
3. The `components.json` registry entry:

   ```json
   {
     "registries": {
       "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
     }
   }
   ```

4. Theme installation:

   ```bash
   bunx shadcn@latest add @ondo-ui/theme @ondo-ui/theme-provider
   ```

5. A first component installation example:

   ```bash
   bunx shadcn@latest add @ondo-ui/button
   ```

The code-block transformer will continue to provide npm, pnpm, yarn, and bun
variants. Laravel will document `laravel new` before the shadcn initialization
command. `theme-provider` will be described as optional where a framework's
React integration requires additional setup; the registry theme and component
installation remain the common path.

## Files

### Create

- `content/docs/installation/meta.json`
- `content/docs/installation/next.mdx`
- `content/docs/installation/next.ko.mdx`
- `content/docs/installation/vite.mdx`
- `content/docs/installation/vite.ko.mdx`
- `content/docs/installation/tanstack.mdx`
- `content/docs/installation/tanstack.ko.mdx`
- `content/docs/installation/laravel.mdx`
- `content/docs/installation/laravel.ko.mdx`
- `content/docs/installation/react-router.mdx`
- `content/docs/installation/react-router.ko.mdx`
- `content/docs/installation/astro.mdx`
- `content/docs/installation/astro.ko.mdx`
- `content/docs/installation/manual.mdx`
- `content/docs/installation/manual.ko.mdx`

### Modify

- `content/docs/installation.mdx`
- `content/docs/installation.ko.mdx`
- `scripts/smoke-static-export.ts`

The smoke test will request the new English and Korean installation URLs so a
missing generated page is caught during the GitHub Pages build.

## Static-export behavior

No client-side routing, server action, API route, or runtime registry lookup is
needed. MDX content is compiled at build time, and the existing export
verification already validates that generated local links resolve to published
files. The implementation will not add `basePath`; that remains a deployment
concern only for repository-subpath Pages deployments, not the current custom
domain setup.

## Testing and acceptance criteria

- `bun run test` passes.
- `bun run lint` passes.
- `bun run typecheck` passes.
- `bun run build` produces all seven English and Korean installation routes.
- `scripts/verify-static-export.ts` accepts the generated static files.
- The smoke path list includes `/docs/installation/<framework>/` and
  `/ko/docs/installation/<framework>/` for every framework.
- All framework cards resolve to existing localized documentation pages.
- Every framework guide contains a working framework initialization command,
  the Ondo registry URL, theme installation, and a component installation
  example.

