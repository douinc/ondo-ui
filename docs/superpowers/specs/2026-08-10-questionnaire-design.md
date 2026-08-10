# Questionnaire Design

## Goal

Add the upstream Base UI Questionnaire composition to ondo-ui as a fully
registered registry component. Preserve the upstream public API, behavior,
visual patterns, and all 14 examples while adapting only paths, imports,
icons, and ondo-ui release metadata.

## Decisions

- Use `@shadcn/react/questionnaire` as the headless behavior source of truth.
- Add the styled ondo-ui wrapper at `components/ui/questionnaire.tsx`.
- Port all 14 upstream Base UI examples without reducing feature coverage.
- Keep upstream example copy and layout; make only mechanical ondo-ui import
  and registry-path changes.
- Replace the upstream multi-library `IconPlaceholder` with
  `@tabler/icons-react`.
- Upgrade `@shadcn/react` to `0.3.0` or newer, which exports Questionnaire.
- Do not add a permanent component-specific test file. Use the existing test,
  typecheck, lint, build, and registration checks. Remove any temporary test
  file after the complete verification run.

## Source of truth

- Headless primitive: `/Users/initred/Code/ui/packages/react/src/questionnaire`.
- Base UI wrapper:
  `/Users/initred/Code/ui/apps/v4/registry/bases/base/ui/questionnaire.tsx`.
- Base UI examples:
  `/Users/initred/Code/ui/apps/v4/examples/base/questionnaire-*.tsx`.
- Feature and API docs:
  `/Users/initred/Code/ui/apps/v4/content/docs/components/base/questionnaire.mdx`.

The ondo wrapper must not duplicate the questionnaire state machine. It imports
the primitive, forwards its props, and supplies ondo-ui visual composition.

## Public component architecture

Create `components/ui/questionnaire.tsx` as a Client Component exporting:

```text
Questionnaire
QuestionnaireActions
QuestionnaireChoice
QuestionnaireChoiceDescription
QuestionnaireChoices
QuestionnaireDescription
QuestionnaireError
QuestionnaireInput
QuestionnaireItem
QuestionnaireNext
QuestionnairePrevious
QuestionnaireProgress
QuestionnaireSkip
QuestionnaireSubmit
QuestionnaireTitle
```

Each export maps to the matching primitive part, adds `data-slot` markers,
forwards `className`, and merges classes through `cn()`.

`QuestionnaireChoice` composes the primitive choice with a full-size invisible
`ChoiceInput`, a visible radio/checkbox indicator, a label/content region, and
the optional shortcut marker. `QuestionnaireInput` keeps primitive freeform
behavior and adds an ondo layout wrapper. Navigation actions use
`buttonVariants` from ondo-ui's Button and forward primitive action props.

The primitive owns item ordering, active-item state, answer selection,
freeform/default values, required validation, skip state, navigation,
shortcuts, answer keyboard movement, native `FormData` serialization, and
server-rendered collection state. The host owns persistence, transport,
close/cancel behavior, external schema validation, and conditional data.

## Styling

Use the upstream Base UI wrapper classes as the visual baseline and preserve
ondo-ui semantic tokens (`background`, `foreground`, `card`, `muted`,
`muted-foreground`, `border`, `input`, `primary`, `ring`, and `destructive`).
Do not add theme variables, Radix APIs, `asChild`, or a new icon system.

The existing primitive `data-*` states remain available for checked,
disabled, invalid, active, first/last, hidden, shortcut, filled, and empty
styles. Consumer `className` values continue to win through `cn()`.

## Documentation examples

Create and alphabetically register one default-exported demo for each:

```text
questionnaire-demo
questionnaire-animated
questionnaire-card
questionnaire-conditional
questionnaire-controlled
questionnaire-dialog
questionnaire-freeform
questionnaire-multiple
questionnaire-navigation-state
questionnaire-progress
questionnaire-resume
questionnaire-shortcuts
questionnaire-skip
questionnaire-validation
```

The demos preserve the upstream content and behavior: animation, Card/Dialog
composition, conditional questions, controlled navigation, freeform and
multiple answers, custom progress, resume/reset, shortcuts, explicit skip,
navigation state, and external Zod validation.

Only imports change to ondo-ui components (`Button`, `Card`, `Dialog`,
`NativeSelect`, and Tabler icons). No feature or example is removed.

## Documentation and localization

Create:

- `content/docs/components/questionnaire.mdx`
- `content/docs/components/questionnaire.ko.mdx`

Both pages follow frontmatter → lead preview → Installation → Usage →
Examples → API reference. The English page preserves upstream descriptions and
feature coverage. The Korean page translates headings and prose while keeping
component names, prop names, types, and identifiers unchanged. Installation
uses:

```bash
bunx shadcn@latest add @ondo-ui/questionnaire
```

The manual-install section documents `@shadcn/react` and the required ondo-ui
registry dependencies.

## Registry and site registration

Register all eight locations required by `.claude/skills/add-component/SKILL.md`:

1. `components/ui/questionnaire.tsx`;
2. all 14 demo files;
3. `components/demos/index.tsx` imports and map;
4. both component MDX pages;
5. `content/docs/components/meta.json`;
6. `registry.json`;
7. `lib/components-list.ts`;
8. `packages/design-inspector/src/catalog.ts`.

The `registry:ui` item contains only the wrapper file:

```json
{
  "dependencies": ["@shadcn/react", "@tabler/icons-react"],
  "registryDependencies": ["@ondo-ui/button", "@ondo-ui/utils"]
}
```

Add the gallery description:

- English: `A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.`
- Korean: `단일 선택, 다중 선택, 자유 입력 및 건너뛰기를 지원하는 다단계 설문 컴포넌트입니다.`

Add `questionnaire` to `ONDO_COMPONENT_NAMES` so the Design Inspector catalog
and registry cross-check recognize it.

## Dependency and release metadata

Update the root dependency and lockfile so
`@shadcn/react/questionnaire` resolves from `@shadcn/react` `0.3.0` or newer.

Add a Changesets minor entry for `packages/ondo-ui-cli`. The approved public
release target is `1.6.0`; release automation remains the source of truth for
applying the package version bump. Add:

- `content/docs/changelog/2026-08-10-questionnaire.mdx`
- `content/docs/changelog/2026-08-10-questionnaire.ko.mdx`

Both changelogs contain `version: 1.6.0` and `**v1.6.0**`. Do not add dated
entries to `content/docs/changelog/meta.json`.

## Verification and acceptance criteria

The implementation is complete when the wrapper exports the documented API,
all 14 previews render in both locales, and the upstream single, multiple,
freeform, skipped, controlled, conditional, resumed, shortcut, animated, and
externally validated flows remain functional.

The component must appear in the docs sidebar and gallery, the namespaced
registry install must resolve, the Design Inspector registry test must pass,
and no temporary or permanent questionnaire-specific test file remains unless
the repository adopts a matching component-test convention.

Run:

```bash
python3 .claude/skills/add-component/scripts/check-registration.py questionnaire
bun test
bun run typecheck
bunx eslint components/ui/questionnaire.tsx components/demos/questionnaire-*.tsx
bun run build
```

After verification, inspect `git status` and remove temporary test files. Also
check all 14 previews in light/dark mode at desktop and narrow mobile widths,
with extra focus and overflow checks for Card and Dialog examples.

## Out of scope

- Copying the headless primitive source or its upstream test suite into ondo-ui.
- Adding Radix or React Aria variants.
- Adding new theme tokens, persistence helpers, or unrelated form abstractions.
- Redesigning or reducing the upstream examples.
- Permanently adding a component-specific test without an existing repository
  convention for such tests.
