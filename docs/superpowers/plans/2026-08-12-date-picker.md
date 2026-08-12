# Date Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the upstream Base UI Date Picker composition to ondo-ui with all eight examples, matching English/Korean documentation, complete registry discovery, and `v1.7.0` release metadata.

**Architecture:** Date Picker remains a documented composition of existing `Calendar`, `Popover`, `Button`, `Field`, `Input`, and `InputGroup` primitives; no stateful `DatePicker` root abstraction is introduced. The required `components/ui/date-picker.tsx` is a small registry entry point that re-exports those composition parts, while interactive behavior lives independently in eight client-side demo files.

**Tech Stack:** Next.js 16.2 App Router, React 19.2, TypeScript 5.9, Tailwind CSS 4, Base UI, `react-day-picker`, `date-fns`, `chrono-node`, Tabler Icons, Fumadocs MDX, shadcn registry build, Bun, Changesets.

## Global Constraints

- Treat `/Users/initred/code/ui/apps/v4/content/docs/components/base/date-picker.mdx` and its eight matching files under `/Users/initred/code/ui/apps/v4/examples/base/` as the behavioral and documentation source.
- Preserve upstream section order, interaction behavior, state ownership, selection modes, and all eight examples: lead, basic, range, date of birth, input, time, natural language, and RTL.
- Adapt only import paths, Tabler icon names, Base UI `render` trigger composition, local docs links, and the unavailable upstream site language selector.
- Replace the site-only selector in the RTL example with a static Arabic `dir="rtl"` demonstration using `date-fns` and DayPicker `arSA` locales; preserve Arabic formatting and right-to-left layout.
- Re-export existing primitives from `components/ui/date-picker.tsx`; do not create a `DatePicker` component, duplicate primitive implementation, add global CSS, or change existing primitive behavior.
- Add `chrono-node@^2.8.2` as a direct root dependency for the natural-language demo. `date-fns`, `react-day-picker`, and `@tabler/icons-react` are already present.
- Every demo is a no-props default-exported client component. Keep demo imports and map keys alphabetical.
- Keep the eight registry/doc/catalog registration lists alphabetical. The registry item is `registry:ui`, contains only `components/ui/date-picker.tsx`, has no npm `dependencies`, and declares `registryDependencies` for `utils`, `button`, `calendar`, `field`, `input`, `input-group`, and `popover`.
- Add a minor Changeset for `@dou.so/ondo-ui`; do not manually edit `packages/ondo-ui-cli/package.json`. Add bilingual web changelog entries with `version: 1.7.0` and `**v1.7.0**`.
- `components/ui/date-picker.contract.test.tsx` is temporary evidence only. Delete it after all verification succeeds so the final branch contains no component-specific test file, consistent with the other components.
- Before writing any interactive code, read `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` as required by `AGENTS.md`.

## File Structure

**Create:**

- `components/ui/date-picker.tsx` — registry composition entry point.
- `components/ui/date-picker.contract.test.tsx` — temporary contract check; delete in Task 7.
- `components/demos/date-picker-demo.tsx`
- `components/demos/date-picker-basic.tsx`
- `components/demos/date-picker-range.tsx`
- `components/demos/date-picker-dob.tsx`
- `components/demos/date-picker-input.tsx`
- `components/demos/date-picker-time.tsx`
- `components/demos/date-picker-natural-language.tsx`
- `components/demos/date-picker-rtl.tsx`
- `content/docs/components/date-picker.mdx`
- `content/docs/components/date-picker.ko.mdx`
- `.changeset/date-picker.md`
- `content/docs/changelog/2026-08-12-date-picker.mdx`
- `content/docs/changelog/2026-08-12-date-picker.ko.mdx`

**Modify:**

- `package.json` and `bun.lock` — add and lock `chrono-node`.
- `components/demos/index.tsx` — add the eight imports and map entries.
- `content/docs/components/meta.json` — add `date-picker` after `context-menu`.
- `registry.json` — add the Date Picker UI registry item after `context-menu`.
- `lib/components-list.ts` — add the bilingual gallery description after `context-menu`.
- `packages/design-inspector/src/catalog.ts` — add `date-picker` after `context-menu`.

---

### Task 1: Establish the composition entry point and dependency contract

**Files:**

- Create: `components/ui/date-picker.contract.test.tsx`, `components/ui/date-picker.tsx`
- Modify: `package.json`, `bun.lock`
- Reference: `components/ui/calendar.tsx`, `components/ui/popover.tsx`, `components/ui/field.tsx`, `components/ui/input-group.tsx`, and the local Next.js `use client` guide

- [ ] **Step 1: Read the Next.js Client Component guide and inspect primitive exports.** Confirm that every interactive demo begins with the exact `"use client"` directive and record only names that actually export from the existing primitives.

- [ ] **Step 2: Write a failing temporary Bun contract test.** Check that the Date Picker module exports `Button`, `Calendar`, `CalendarDayButton`, `Field`, `FieldGroup`, `FieldLabel`, `Input`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `Popover`, `PopoverContent`, and `PopoverTrigger`; also check that all eight demo paths, both docs paths, and both release paths exist once subsequent tasks complete. Run `bun test components/ui/date-picker.contract.test.tsx` and confirm the expected initial failure.

- [ ] **Step 3: Implement the thin re-export module.** Export exactly the verified primitive names from their established `@/components/ui/*` modules. Do not add runtime state, markup, styles, or a default export.

- [ ] **Step 4: Install the natural-language parser.** Run `bun add chrono-node@^2.8.2`, inspect the resulting `package.json` and lockfile diff, and ensure no unrelated dependency versions change.

- [ ] **Step 5: Prove the first contract increment.** Re-run the focused test for exports, then `bun run typecheck`; leave the file-existence assertions intentionally failing until the documented files have been created.

- [ ] **Step 6: Commit the focused change.** Use an English conventional commit message, for example `feat(date-picker): Add composition entry point`.

### Task 2: Port the four calendar-selection demos

**Files:**

- Create: `components/demos/date-picker-demo.tsx`, `date-picker-basic.tsx`, `date-picker-range.tsx`, `date-picker-dob.tsx`
- Reference: the respective upstream Base example files and existing `components/demos/calendar-*.tsx`

- [ ] **Step 1: Add the lead date picker demo.** Use a controlled `Date | undefined`, `format(date, "PPP")`, an `IconChevronDown` trigger rendered through `PopoverTrigger`, and a single-select `Calendar` whose visible month follows the selected value.

- [ ] **Step 2: Add Basic and Range Picker.** Basic uses `Field`/`FieldLabel` and a single selection. Range uses `DateRange`, `addDays`, `numberOfMonths={2}`, and the exact upstream default range behavior, with OnDo/Tabler imports only.

- [ ] **Step 3: Add Date of Birth.** Use controlled Popover open state, `captionLayout="dropdown"`, a date value, and close the Popover immediately after a valid single-date selection.

- [ ] **Step 4: Extend the temporary test with focused source assertions.** Verify the four files have `"use client"`, default exports, and the expected distinctive behavior (`mode="range"`, `numberOfMonths={2}`, and DOB close-on-select) before implementing; run it red, then green.

- [ ] **Step 5: Run focused quality checks and commit.** Run `bun test components/ui/date-picker.contract.test.tsx`, `bun run typecheck`, and `bun run lint components/demos/date-picker-demo.tsx components/demos/date-picker-basic.tsx components/demos/date-picker-range.tsx components/demos/date-picker-dob.tsx`; commit as `feat(date-picker): Add calendar selection demos`.

### Task 3: Port the four advanced interaction demos

**Files:**

- Create: `components/demos/date-picker-input.tsx`, `date-picker-time.tsx`, `date-picker-natural-language.tsx`, `date-picker-rtl.tsx`
- Reference: their upstream counterparts, `components/ui/input-group.tsx`, and `components/demos/calendar-date-and-time-picker.tsx`

- [ ] **Step 1: Add Input Date Picker.** Preserve upstream input text/date/month/open state, English `date-fns` formatting, validity parsing, `InputGroup` keyboard affordance, ArrowDown opening behavior, and close-on-select.

- [ ] **Step 2: Add Time Picker.** Preserve the date Popover plus native `Input type="time"` in a `FieldGroup`, dropdown calendar captions, and close-on-date-select behavior.

- [ ] **Step 3: Add Natural Language Picker.** Import `parseDate` from `chrono-node`; start with `"In 2 days"`, parse user text relative to the current date, synchronize Calendar selection and the readable selected-date summary, and retain the upstream fallback/empty-date behavior.

- [ ] **Step 4: Add static Arabic RTL Picker.** Set `dir="rtl"` on the demo boundary; import `arSA` from `date-fns/locale` and `react-day-picker/locale`; use these for trigger formatting and Calendar locale without referencing an unavailable language-selector component.

- [ ] **Step 5: Add red/green contract assertions and verify.** Assert the parser import, native time input, RTL direction/locales, and input keyboard behavior; run the focused Bun test, typecheck, and lint on the four files.

- [ ] **Step 6: Commit the focused change.** Commit as `feat(date-picker): Add advanced picker demos`.

### Task 4: Register demos and author matching bilingual documentation

**Files:**

- Create: `content/docs/components/date-picker.mdx`, `content/docs/components/date-picker.ko.mdx`
- Modify: `components/demos/index.tsx`, `content/docs/components/meta.json`
- Reference: upstream Date Picker MDX, nearby `calendar.mdx`/`.ko.mdx`, and `components/demos/index.tsx`

- [ ] **Step 1: Add all eight demo imports and preview-map keys.** Place them alphabetically after `context-menu`/before `desktop-window` in `components/demos/index.tsx`, using the exact preview names `date-picker-demo`, `date-picker-basic`, `date-picker-range`, `date-picker-dob`, `date-picker-input`, `date-picker-time`, `date-picker-natural-language`, and `date-picker-rtl`.

- [ ] **Step 2: Write the English page from the upstream structure.** Preserve frontmatter intent, lead preview, composition explanation/diagram, installation guidance linking to `/docs/components/popover#installation` and `/docs/components/calendar#installation`, usage block, React DayPicker link, and the seven named examples in upstream order. Remove only `styleName="base-nova"` and translate source imports to OnDo paths/Tabler icons.

- [ ] **Step 3: Write the Korean page with identical structure.** Translate every heading, explanatory paragraph, callout, and illustrative user-visible string naturally into Korean. Keep component names, package/import names, props, code identifiers, URLs, and preview names unchanged; translate the RTL demo text to appropriate Korean guidance while retaining Arabic display content.

- [ ] **Step 4: Add sidebar metadata.** Insert `date-picker` alphabetically after `context-menu` in the component docs `pages` array.

- [ ] **Step 5: Make the docs contract pass and compile MDX.** Extend the temporary test to check both pages reference all eight exact preview names in the same order and verify it goes green. Run `bun run lint` on touched source/docs-compatible files and `bun run typecheck`.

- [ ] **Step 6: Commit the docs slice.** Commit as `docs(date-picker): Add bilingual Date Picker documentation`.

### Task 5: Complete registry, gallery, and inspector registration

**Files:**

- Modify: `registry.json`, `lib/components-list.ts`, `packages/design-inspector/src/catalog.ts`
- Reference: nearby `calendar`, `context-menu`, and `desktop-window` entries plus `.claude/skills/add-component/scripts/check-registration.py`

- [ ] **Step 1: Add the Date Picker registry item.** Insert alphabetically after `context-menu` with `name: "date-picker"`, `type: "registry:ui"`, the upstream-aligned date-picker description, one `components/ui/date-picker.tsx` file, no npm package dependencies, and exact local registry dependencies: `utils`, `button`, `calendar`, `field`, `input`, `input-group`, and `popover`.

- [ ] **Step 2: Add gallery metadata.** Add the canonical name, English description, and natural Korean description to `lib/components-list.ts` in alphabetical order so `/components` surfaces the item.

- [ ] **Step 3: Add the Design Inspector name.** Insert `"date-picker"` into `ONDO_COMPONENT_NAMES` after `"context-menu"`, retaining its catalog ordering and type grouping.

- [ ] **Step 4: Verify all eight registrations mechanically.** Run `python3 .claude/skills/add-component/scripts/check-registration.py date-picker`, then run the checker with no component argument. Resolve every reported issue before continuing.

- [ ] **Step 5: Commit the registration slice.** Commit as `feat(registry): Register Date Picker`.

### Task 6: Add release metadata

**Files:**

- Create: `.changeset/date-picker.md`, `content/docs/changelog/2026-08-12-date-picker.mdx`, `content/docs/changelog/2026-08-12-date-picker.ko.mdx`
- Reference: `content/docs/versioning.mdx`, the Questionnaire release entries, and existing Changeset files

- [ ] **Step 1: Create the minor Changeset.** Declare `@dou.so/ondo-ui: minor` with a concise English summary of the new Date Picker registry composition. Do not run version application and do not edit package version files.

- [ ] **Step 2: Create English `v1.7.0` web changelog.** Include frontmatter `version: 1.7.0`, body heading `**v1.7.0**`, and concise bullets for the composition, eight Base UI examples, natural language and RTL coverage, and bilingual documentation.

- [ ] **Step 3: Create the matching Korean changelog.** Keep the exact version and feature scope while translating the prose naturally.

- [ ] **Step 4: Extend and run the temporary release contract.** Assert the Changeset package/version and both dated changelog files/versions. Make the temporary test fully green.

- [ ] **Step 5: Commit release metadata.** Commit as `docs: Add Date Picker release notes (v1.7.0)`.

### Task 7: Verify the finished feature, perform visual QA, and remove temporary tests

**Files:**

- Delete: `components/ui/date-picker.contract.test.tsx`
- Inspect: all files created/modified in Tasks 1–6 and generated `public/r/*` output

- [ ] **Step 1: Run pre-removal evidence checks.** Run the Date Picker temporary contract test, both registration checkers, `bun test`, `bun run typecheck`, `bun run lint` on all touched TypeScript/TSX files, `bun run registry:build`, and `bun run build`.

- [ ] **Step 2: Inspect registry output.** Confirm the built Date Picker entry has only `components/ui/date-picker.tsx` as its own file and resolves the declared OnDo registry dependencies, with no demos or documentation accidentally bundled.

- [ ] **Step 3: Perform browser QA.** At desktop and mobile widths, in light and dark mode, visit both `/docs/components/date-picker` and `/ko/docs/components/date-picker`; verify all eight previews render, Popovers open/close, single/range selection works, DOB closes on selection, input opens with keyboard, time accepts input, natural language updates the date, and RTL orientation/Arabic formatting are correct.

- [ ] **Step 4: Delete the temporary contract test only after all assertions above pass.** Confirm `rg --files components/ui | rg 'date-picker.*test'` returns no file, honoring the repo-wide no-per-component-test convention.

- [ ] **Step 5: Re-run final permanent checks.** Run both registration checkers, `bun test`, `bun run typecheck`, `bun run registry:build`, and `bun run build`; inspect `git diff --check` and `git status --short`.

- [ ] **Step 6: Commit cleanup.** Commit the test deletion as `test: Remove temporary Date Picker contract test` (or amend it into the immediately preceding non-release commit only if project history policy explicitly requires a single commit).

### Task 8: Prepare the branch for review

**Files:**

- Inspect: full branch diff against `main`

- [ ] **Step 1: Review the complete diff.** Confirm upstream coverage, bilingual document parity, all eight registration points, version/release metadata, alphabetical ordering, no unrelated changes, and no Date Picker test file remain.

- [ ] **Step 2: Record verification output.** Capture the exact commands and successful results for the review/PR description, including visual QA routes and interaction checks.

- [ ] **Step 3: Request code review before merging.** Use the required review workflow, address only verified feedback, and do not merge or push directly to protected `main`.
