# ZBSearch Migration Design

## Context

Upgrading `fumadocs-core` from 16.11.1 to 16.14.0 changes the static
search engine contract from `@orama/orama` to `zbsearch`. The current
client initializer still returns an Orama database, so TypeScript rejects
it where Fumadocs expects `AnyZBSearch`. The same error blocks the
production static export.

The search endpoint already provides locale-specific exported indexes at
`/api/search`. Korean indexing uses a custom tokenizer because ZBSearch
does not provide a built-in Korean tokenizer.

## Goals

- Use ZBSearch directly for Fumadocs static search.
- Preserve the current English and Korean search behavior.
- Preserve the custom Korean tokenization of letters and numbers across
  punctuation.
- Remove deprecated Fumadocs client API names.
- Remove the obsolete direct Orama dependency.
- Keep the application compatible with a fully static Next.js export.

## Non-Goals

- Changing the search UI or result ranking.
- Adding fuzzy, vector, or remote search.
- Refactoring unrelated command-menu behavior.
- Fixing unrelated dependency audit findings in the same change.

## Approaches Considered

### Direct ZBSearch migration

Replace Orama with a direct, pinned ZBSearch dependency and update both
the database initializer and Fumadocs client API names. This is the
selected approach because it matches the current Fumadocs contract and
removes deprecated compatibility aliases.

### Compatibility-only migration

Return a ZBSearch database while retaining `oramaStaticClient` and
`initOrama`. This reduces the immediate diff but leaves deprecated names
and creates avoidable follow-up work.

### Fumadocs version pin

Keep `fumadocs-core` at 16.11.1. This avoids implementation work but
blocks the intended dependency update and was rejected.

## Dependency Design

- Remove the direct `@orama/orama` dependency.
- Add a direct, exact `zbsearch` dependency at `3.3.4`, the version used
  by the upgraded Fumadocs release.
- Regenerate `bun.lock` with Bun 1.3.14, matching `packageManager` and CI.
- Require `bun install --frozen-lockfile` to succeed after regeneration.

Pinning the direct dependency ensures the application initializer and
Fumadocs use one compatible ZBSearch implementation. Future Fumadocs and
ZBSearch upgrades should be reviewed together.

## Search Architecture

`lib/search-index.ts` remains the single owner of search database
initialization and Korean tokenization.

- `createKoreanTokenizer()` continues to return the tokenizer shared by
  the static search route and client-side database initialization.
- `createStaticSearchIndex(locale)` creates a ZBSearch database.
- Korean databases receive the custom tokenizer.
- Other locales use the ZBSearch default tokenizer.

`app/api/search/route.ts` continues to generate static, locale-specific
search data through `createFromSource`. No route behavior changes are
required.

`components/command-menu.tsx` uses the non-deprecated Fumadocs
`staticClient` API and supplies `createStaticSearchIndex` as `initDB`.
The client fetches `/api/search`, creates a locale-compatible ZBSearch
database, loads the exported index, and performs searches locally.

## Data Flow

1. During `next build`, the static search route indexes English and
   Korean documentation.
2. Fumadocs serializes both indexes into the static `/api/search` output.
3. The command menu fetches the exported data in the browser.
4. `staticClient` calls `initDB` for the requested locale.
5. ZBSearch loads the serialized index into that database.
6. Queries run locally with the same locale-specific tokenizer used for
   indexing.

The route remains statically exportable, and no runtime server is
introduced.

## Error Handling

Fumadocs retains responsibility for reporting a failed search-index
fetch or a missing locale. The migration does not add fallback casts or
silent compatibility adapters. A type mismatch must remain a compile
failure rather than becoming a possible browser runtime failure.

## Test Design

The existing tokenizer test remains the behavior contract for Korean
punctuation and number splitting.

The search-index test will additionally:

- Create English and Korean ZBSearch databases.
- Insert representative documents and serialize the source databases.
- Load the serialized data into fresh locale-specific databases.
- Query the restored Korean database with a Korean term.
- Assert that the expected document is returned.

The implementation is complete only when all of the following pass with
Bun 1.3.14:

1. `bun install --frozen-lockfile`
2. `bun run test`
3. `bun run lint`
4. `bun run typecheck`
5. `bun run build`

The build verification must confirm that the static `/api/search`
artifact contains both English and Korean index data.

## Expected File Changes

- `package.json`
- `bun.lock`
- `lib/search-index.ts`
- `lib/search-index.test.ts`
- `components/command-menu.tsx`

No files under `components/ui/` are added, renamed, or removed, so the
registry-component workflow is not involved.
