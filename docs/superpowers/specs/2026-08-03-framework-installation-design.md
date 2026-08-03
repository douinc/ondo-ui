# Shadcn-Style Installation Navigation and Guides Design

## Goal

Make Ondo UI's installation documentation match the local shadcn/ui documentation
at `/Users/initred/Code/ui` wherever the projects are compatible. The sidebar
must expose one `Installation` entry, while the installation overview provides
shadcn-style selection cards for setup method and framework.

## Scope

The existing seven Ondo framework paths remain supported:

- Next.js
- Vite
- TanStack Start
- Laravel
- React Router
- Astro
- Manual

Both English and Korean pages use the same structure and route set. This work
does not add shadcn-only Gatsby, Remix, or TanStack Router pages.

## Architecture

The existing Fumadocs MDX pages remain the source of truth. The root
`content/docs/installation.mdx` and `installation.ko.mdx` pages provide the
overview. Pages under `content/docs/installation/` remain separate framework
routes so each guide is linkable, statically exported, and searchable.

The existing generic sidebar flattens nested Fumadocs folders. Update that
flattening boundary so the `installation` folder's child pages are omitted
from sidebar groups while the root `installation` page remains visible. This
preserves the current page tree and avoids hard-coding a second sidebar model.

## Navigation and overview design

The sidebar shows `Installation` as a single menu item; it does not show a
`Frameworks` group or the seven child guides.

The overview follows shadcn's order and card layout:

1. A recommendation callout.
2. Three setup cards linking to `#use-create`, `#use-cli`, and
   `#existing-project`.
3. A `Use shadcn/create` section with an external link to
   `https://ui.shadcn.com/create`, because Ondo is hosted as a GitHub Pages
   static site and does not own the `/create` route.
4. A `Use the CLI` section with shadcn-compatible initialization commands.
5. An `Existing Project` section.
6. A seven-card framework chooser linking to each detailed guide.

The cards are `LinkedCard` route links, matching the actual shadcn source. They
are not literal `<Tabs>` controls: each framework guide is a separate route,
which preserves direct links, browser navigation, static export, and SEO.
Use shadcn's inline framework logos where available so the visual presentation
matches the reference. Korean `LinkedCard` URLs retain the explicit `/ko` prefix
required by Ondo's direct-link implementation.

## Framework guide content

Each framework guide follows shadcn's three setup choices:

- `Use shadcn/create`: link to the external shadcn/create template for the
  framework when the template exists.
- `Use the CLI`: show the framework's shadcn initialization command.
- `Existing Project`: show framework-specific manual prerequisites and setup.

Only Ondo-specific differences are inserted into the shared flow:

- register `@ondo-ui` using
  `https://ui.ondo.dou.so/r/{name}.json` in `components.json`;
- install `@ondo-ui/theme` and `@ondo-ui/theme-provider` where applicable;
- install Ondo components such as `@ondo-ui/button` rather than shadcn's local
  component registry;
- change descriptions and examples to identify Ondo UI.

The existing registry URL, theme/provider guidance, and component examples are
preserved rather than replaced by shadcn-only examples. All framework pages
remain available in English and Korean.

## GitHub Pages compatibility

The implementation keeps `output: "export"` and `trailingSlash: true`. It adds
no runtime route, server action, API dependency, or client-side tab state.
External shadcn/create links use absolute URLs. Local framework links use the
existing locale-aware conventions and are verified against generated static
files.

## Testing and acceptance criteria

- Sidebar tests prove the root `Installation` page is present and its nested
  framework pages are absent from sidebar groups.
- The root English and Korean pages contain the three setup cards and all seven
  framework cards.
- All seven English and seven Korean framework routes build successfully.
- Framework pages contain the applicable initialization command, Ondo registry
  URL, theme/provider installation, and component installation example.
- `bun run test` passes.
- `bun run lint` passes with no new errors.
- `bun run typecheck` passes.
- `bun run build` succeeds and emits the required static pages.
- The static export smoke test passes for the overview and all framework routes.
