# Stepper Design

## Goal

Add a production-ready `Stepper` registry component to ondo-ui using the public
API and documentation supplied for ReUI, while adapting the implementation and
examples to ondo-ui's Base UI, icon, documentation, registry, localization, and
release conventions.

## Source of truth

The supplied Stepper document is authoritative for the documentation structure,
the 14 example headings, and the public API. The current files under
`/Users/initred/code/reui` are reference implementations for behavior and visual
patterns, but their numbered examples are not authoritative because several
current files no longer match the supplied document headings.

The port must preserve ReUI's component semantics and visual character. It may
make compatibility and accessibility corrections that do not change the public
API. It must not copy ReUI-only paths or APIs that do not exist in ondo-ui.

## Public component architecture

Create `components/ui/stepper.tsx` as a Client Component. It will expose the
following components, hooks, and types:

- `Stepper`
- `StepperNav`
- `StepperItem`
- `StepperTrigger`
- `StepperIndicator`
- `StepperSeparator`
- `StepperTitle`
- `StepperDescription`
- `StepperPanel`
- `StepperContent`
- `useStepper`
- `useStepItem`
- `StepperProps`
- `StepperItemProps`
- `StepperTriggerProps`
- `StepperContentProps`
- `StepIndicators`

`Stepper` owns the active step, orientation, indicator overrides, and trigger
registration. `StepperItem` derives the state for one numbered step and exposes
it to its descendants. The remaining parts are presentational or interactive
slots composed through those contexts.

The implementation will use React state and context, Base UI's `mergeProps` and
`useRender`, and `cn` from `@/lib/utils`. It will not introduce Radix, `Slot`, or
an `asChild` prop.

## Public API contract

### Stepper

- `defaultValue?: number` defaults to `1` and initializes uncontrolled state.
- `value?: number` selects controlled mode when defined.
- `onValueChange?: (value: number) => void` fires after an enabled trigger asks
  to select a step.
- `orientation?: "horizontal" | "vertical"` defaults to `"horizontal"`.
- `indicators?: StepIndicators` replaces indicator contents by state.

```tsx
type StepIndicators = {
  active?: React.ReactNode
  completed?: React.ReactNode
  inactive?: React.ReactNode
  loading?: React.ReactNode
}
```

### StepperItem

- `step: number` is required and identifies the item and its content panel.
- `completed?: boolean` defaults to `false` and explicitly marks completion.
- `disabled?: boolean` defaults to `false` and prevents selection.
- `loading?: boolean` defaults to `false`; the loading indicator is shown only
  when that item is also active.

An item is completed when `completed` is true or its `step` is less than the
active step. Otherwise it is active when its number equals the active step, and
inactive in all other cases. Loading is an additional flag and takes visual
precedence when selecting custom indicator content.

### StepperTrigger

`StepperTrigger` renders a button by default. Its `render` prop accepts a React
element and merges the trigger's behavior, accessibility attributes, ref, and
styles onto that element through Base UI `useRender`.

### StepperContent

- `value: number` is required and associates the content with one step.
- `forceMount?: boolean` defaults to `false`. Inactive content is absent by
  default; forced inactive content stays mounted and hidden.

The other public parts accept the native props and `className` for their default
HTML element without adding undocumented behavioral props.

## Interaction and accessibility

The step navigation uses the tab pattern:

- `StepperNav` has `role="tablist"` and the configured `aria-orientation`;
  `Stepper` remains the neutral root container around navigation and panels.
- Each enabled trigger has `role="tab"`, `aria-selected`, `aria-controls`, and
  roving `tabIndex`.
- Arrow keys move focus among enabled triggers, while Home and End move to the
  first and last enabled trigger. Enter and Space select the focused enabled
  step. Disabled triggers are skipped during focus movement.
- Disabled triggers cannot be clicked, selected from the keyboard, or chosen by
  an interactive example control.
- Each content node has `role="tabpanel"`, an `id` matching its trigger's
  `aria-controls`, and `aria-labelledby` pointing back to that trigger.
- IDs include a per-Stepper React `useId` prefix so multiple steppers on one
  page cannot collide.
- Trigger registration must clean up on unmount and retain document order so
  keyboard focus remains correct after rerenders.

The component exposes `data-slot`, `data-state`, `data-loading`, and
`data-orientation` attributes used by the ReUI styling patterns and consumer
overrides.

## Styling

Start from the ReUI Base implementation's Tailwind classes and state selectors.
Keep the component self-contained and use ondo-ui's existing semantic tokens,
including `primary`, `muted`, `accent`, `border`, `ring`, and the existing
`success` token used by examples. No new theme token is required.

Remove ReUI-only import paths. ReUI's multi-icon `IconPlaceholder` is replaced
with direct imports from the already installed `@tabler/icons-react` package.
Examples that use `Badge` or `Button` import the ondo-ui components and use their
actual variants. ReUI badge props such as `size="sm"`, `primary-light`, and
`success-light` are not copied because they do not exist in ondo-ui.

## Documentation examples

Create one default-exported demo file per example and register every file in
`components/demos/index.tsx`. The filenames are descriptive instead of retaining
ReUI's unstable `c-stepper-*` numbering.

| Supplied section | Demo name | Required presentation |
| --- | --- | --- |
| Lead preview | `stepper-demo` | Four numbered horizontal steps, defaulting to step 2, with a content panel. |
| States | `stepper-states` | Completed steps use success styling, the active step uses primary styling, and inactive steps remain muted. |
| Indicators | `stepper-indicators` | Custom completed check, active dot, and loading spinner indicators. |
| Controlled | `stepper-controlled` | Controlled value with Previous and Next buttons bounded to valid step numbers. |
| Progress | `stepper-progress` | Segmented progress bars, current/total status, Back and Next controls, and active content. |
| Title | `stepper-title` | Circular indicators with a title below each step. |
| Title & Bar | `stepper-title-bar` | Full-width bar indicators paired with titles. |
| Title & Status | `stepper-title-status` | Icon indicators, step titles, state badges, connectors, and Previous/Next controls. |
| Title & Description | `stepper-title-description` | Stacked title and supporting description under each indicator. |
| Inline Title | `stepper-inline-title` | Indicator and title on the same horizontal line. |
| Inline Title & Description | `stepper-inline-title-description` | Indicator beside a stacked title and description. |
| Vertical | `stepper-vertical` | Vertical numbered indicators and connectors without titles. |
| Vertical Title | `stepper-vertical-title` | Vertical indicators with titles. |
| Vertical Title & Description | `stepper-vertical-title-description` | Vertical indicators with titles and supporting descriptions. |

These presentations are reconstructed from the closest current ReUI examples so
the visible result matches the supplied headings. The current numbered ReUI
files are not copied in their mismatched order, and the undocumented fifteenth
example is not added as a separate docs section.

## Documentation and localization

Create `content/docs/components/stepper.mdx` and
`content/docs/components/stepper.ko.mdx`. Both pages follow the supplied order:
frontmatter, lead preview, Installation, Usage, Examples, and API Reference.

The English page preserves the supplied descriptions and API text. The Korean
page translates headings and explanatory prose while keeping component names,
prop names, type signatures, and code identifiers unchanged. Demo source shown
by `ComponentPreview` comes from the registered demo files, consistent with the
current ondo-ui preview implementation.

The following ReUI-specific values are replaced:

- `npx shadcn@latest add @reui/stepper` becomes
  `bunx shadcn@latest add @ondo-ui/stepper`.
- `@/components/reui/stepper` becomes `@/components/ui/stepper`.
- `styleName="base-nova"` is removed because ondo-ui's `ComponentPreview` does
  not define that prop.
- Each `c-stepper-*` preview key becomes its descriptive `stepper-*` key.
- The ReUI-only frontmatter field `base: base` is omitted.

## Registry and site registration

Register Stepper in every location required by
`.claude/skills/add-component/SKILL.md`:

1. `components/ui/stepper.tsx`
2. `components/demos/stepper-*.tsx`
3. `components/demos/index.tsx`
4. `content/docs/components/stepper.mdx` and `stepper.ko.mdx`
5. `content/docs/components/meta.json`
6. `registry.json`
7. `lib/components-list.ts`

Entries remain alphabetical. The `registry:ui` item is named `stepper`, contains
only `components/ui/stepper.tsx`, declares `@base-ui/react` as an npm dependency,
and declares `utils` as its registry dependency. Demo-only dependencies such as
`button` and `badge` are not added to the Stepper registry item.

The gallery description is:

- English: `A step-by-step process for users to navigate through a series of steps.`
- Korean: `사용자가 여러 단계를 차례로 탐색할 수 있는 단계별 진행 과정입니다.`

## Release

This is a new registry item, so it receives a MINOR release under
`content/docs/versioning.mdx`:

- Bump `package.json` from `1.1.0` to `1.2.0`.
- Add `content/docs/changelog/2026-08-01-stepper.mdx`.
- Add `content/docs/changelog/2026-08-01-stepper.ko.mdx`.
- Put `version: 1.2.0` in both frontmatter blocks and `**v1.2.0**` at the top of
  both bodies.
- Do not add dated entries to `content/docs/changelog/meta.json`.

The changelog describes the controlled and uncontrolled modes, horizontal and
vertical layouts, state and indicator customization, keyboard interaction,
content mounting, and the included examples.

## Verification and acceptance criteria

The work is complete when all of the following are true:

- The component exports exactly the documented public parts and types.
- All 14 supplied documentation sections render the presentation named by their
  heading in both locales.
- Controlled and uncontrolled selection, loading/completed/disabled states,
  `forceMount`, trigger rendering, and keyboard navigation behave as specified.
- Multiple Stepper instances have unique trigger and panel IDs.
- The English and Korean pages use ondo-ui installation/import instructions.
- Stepper appears in the docs sidebar and `/components` gallery.
- `shadcn add @ondo-ui/stepper` can resolve a registry item containing only the
  component file and its required registry dependencies.
- Version and both changelog entries consistently report `1.2.0`.
- The following commands pass from the repository root:

```bash
python3 .claude/skills/add-component/scripts/check-registration.py stepper
bun test
bun run typecheck
bunx eslint components/ui/stepper.tsx components/demos/stepper-*.tsx
bun run build
```

Visual verification must also cover every preview in light and dark mode at a
desktop width, plus horizontal overflow and the three vertical examples at a
narrow mobile width.

## Out of scope

- Adding a fifteenth documentation example that is absent from the supplied
  document.
- Renaming or refactoring existing ondo-ui components.
- Adding new theme tokens or npm packages.
- Publishing, pushing directly to `main`, or creating a pull request.
