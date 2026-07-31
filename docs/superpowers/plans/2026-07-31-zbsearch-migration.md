# ZBSearch Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the upgraded Fumadocs static search integration from Orama to ZBSearch while preserving English and Korean search behavior.

**Architecture:** `lib/search-index.ts` will create ZBSearch databases and own the shared Korean tokenizer. The static API route will continue to serialize locale-specific indexes, while the command menu will use Fumadocs `staticClient` with `initDB`. Tests will exercise tokenizer behavior and a save/load/search round trip.

**Tech Stack:** Bun 1.3.14, TypeScript, ZBSearch 3.3.4, Fumadocs Core 16.14.0, Next.js 16.2.11, Bun Test.

## Global Constraints

- Remove the direct `@orama/orama` dependency.
- Add the exact `zbsearch@3.3.4` dependency.
- Keep `packageManager` and CI on Bun 1.3.14.
- Preserve the existing custom Korean tokenizer and static `/api/search` export.
- Do not add fallback type casts or compatibility adapters that hide type errors.
- Do not modify files under `components/ui/`.

---

### Task 1: Lock the ZBSearch dependency graph

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

**Interfaces:**
- Consumes: The already-updated `fumadocs-core@16.14.0` dependency.
- Produces: A single direct `zbsearch@3.3.4` dependency and a lockfile reproducible with Bun 1.3.14.

- [ ] **Step 1: Write the dependency change**

Remove `@orama/orama` and add the exact ZBSearch version:

~~~json
{
  "dependencies": {
    "zbsearch": "3.3.4"
  }
}
~~~

- [ ] **Step 2: Regenerate the lockfile**

Run:

~~~bash
bunx --bun bun@1.3.14 install
~~~

Expected: `@orama/orama` is absent from the dependency graph and
`zbsearch@3.3.4` is resolved without unrelated package changes.

- [ ] **Step 3: Verify frozen installation**

Run:

~~~bash
bunx --bun bun@1.3.14 install --frozen-lockfile
~~~

Expected: the install succeeds without modifying `package.json` or
`bun.lock`.

- [ ] **Step 4: Commit the dependency boundary**

~~~bash
git add package.json bun.lock
git commit -m "chore: migrate search dependency to zbsearch"
~~~

### Task 2: Add a failing ZBSearch search round-trip test

**Files:**
- Modify: `lib/search-index.test.ts`

**Interfaces:**
- Consumes: `createKoreanTokenizer` and the future `createStaticSearchIndex` return value.
- Produces: A regression test proving a serialized Korean ZBSearch index can be restored and searched.

- [ ] **Step 1: Replace the Orama wording and add ZBSearch imports**

Use the public ZBSearch APIs in the test:

~~~ts
import { insert, load, save, search } from "zbsearch"
~~~

- [ ] **Step 2: Write the failing round-trip test**

Add a test with this behavior:

~~~ts
test("restores and searches a Korean index", () => {
  const source = createStaticSearchIndex("ko")
  insert(source, { _: "온도 UI 버튼 입력" })

  const restored = createStaticSearchIndex("ko")
  load(restored, save(source))

  const result = search(restored, { term: "입력" })
  expect(result.hits).toHaveLength(1)
  expect(result.hits[0]?.document._).toContain("버튼")
})
~~~

The test must use the actual function return types and adjust only the
document assertion shape if ZBSearch's typed result requires it.

- [ ] **Step 3: Run the focused test before implementation**

Run:

~~~bash
bunx --bun bun@1.3.14 test lib/search-index.test.ts
~~~

Expected: the existing tokenizer tests pass, while the new round-trip test
fails because `createStaticSearchIndex` still returns an Orama database.

### Task 3: Migrate the search database factory

**Files:**
- Modify: `lib/search-index.ts`

**Interfaces:**
- Consumes: `zbsearch.create` and the existing `createKoreanTokenizer` behavior.
- Produces: `createStaticSearchIndex(locale?: string)` returning a ZBSearch database accepted by Fumadocs `initDB`.

- [ ] **Step 1: Replace the engine import**

Change the factory import to:

~~~ts
import { create } from "zbsearch"
~~~

- [ ] **Step 2: Preserve the locale-specific factory behavior**

Keep the existing schema and apply the custom tokenizer only for Korean:

~~~ts
export function createStaticSearchIndex(locale?: string) {
  if (locale === "ko") {
    return create({
      schema: { _: "string" },
      components: { tokenizer: createKoreanTokenizer() },
    })
  }

  return create({ schema: { _: "string" } })
}
~~~

- [ ] **Step 3: Run the focused tests**

Run:

~~~bash
bunx --bun bun@1.3.14 test lib/search-index.test.ts
~~~

Expected: tokenizer and serialized Korean search tests pass.

### Task 4: Update the Fumadocs client API names

**Files:**
- Modify: `components/command-menu.tsx`

**Interfaces:**
- Consumes: `createStaticSearchIndex` returning a ZBSearch database.
- Produces: A typed Fumadocs static client using the current API names.

- [ ] **Step 1: Use the current static client export**

Replace the deprecated import and option name:

~~~ts
import { staticClient } from "fumadocs-core/search/client/orama-static"

const searchClient = React.useMemo(
  () =>
    staticClient({
      from: "/api/search",
      locale: lang,
      initDB: createStaticSearchIndex,
    }),
  [lang]
)
~~~

The module path remains unchanged because Fumadocs 16.14.0 exports the
renamed client from that compatibility path.

- [ ] **Step 2: Run typecheck**

Run:

~~~bash
bunx --bun bun@1.3.14 run typecheck
~~~

Expected: the previous `Orama is not assignable to AnyZBSearch` error is
gone.

### Task 5: Verify the static export and full quality gate

**Files:**
- Verify: `app/api/search/route.ts`
- Verify: `scripts/verify-static-export.ts`
- Verify: `scripts/smoke-static-export.ts`

**Interfaces:**
- Consumes: The migrated ZBSearch factory and Fumadocs static client.
- Produces: A working static `/api/search` artifact containing both locales.

- [ ] **Step 1: Run the complete test suite**

~~~bash
bunx --bun bun@1.3.14 run test
~~~

Expected: all tests pass.

- [ ] **Step 2: Run lint**

~~~bash
bunx --bun bun@1.3.14 run lint
~~~

Expected: zero errors; pre-existing warnings may remain.

- [ ] **Step 3: Build the static site**

~~~bash
NEXT_TELEMETRY_DISABLED=1 bunx --bun bun@1.3.14 run build
~~~

Expected: the build exits successfully and generates `out/api/search`.

- [ ] **Step 4: Verify the published search artifact**

~~~bash
bunx --bun bun@1.3.14 run export:verify
~~~

Expected: `/api/search` has type `i18n` and contains both `en` and `ko`
indexes.

- [ ] **Step 5: Inspect the final diff**

~~~bash
git diff --check
git status --short
~~~

Expected: only the planned dependency and search files are modified, with
no generated or unrelated files included.

- [ ] **Step 6: Commit the migration**

~~~bash
git add lib/search-index.ts lib/search-index.test.ts components/command-menu.tsx
git commit -m "fix: migrate static search to zbsearch"
~~~
