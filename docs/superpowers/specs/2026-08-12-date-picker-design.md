# Date Picker Design

## Goal

Add the Base UI Date Picker offering from the upstream shadcn UI repository to
ondo-ui as an installable, documented registry item. It must provide every
upstream Base example and matching English and Korean documentation.

## Source and Scope

- Source documentation:
  `/Users/initred/code/ui/apps/v4/content/docs/components/base/date-picker.mdx`
- Source examples:
  `/Users/initred/code/ui/apps/v4/examples/base/date-picker-*.tsx`
- The delivery includes these eight examples, in upstream order: lead demo,
  basic, range, date of birth, input, time, natural language, and RTL.
- It does not change the existing `Calendar`, `Popover`, `Field`, `Input`, or
  `InputGroup` components except where an already-required dependency must be
  registered.

## Architecture

Upstream Date Picker is a composition of `Popover` and `Calendar`; it has no
`DatePicker` root primitive. Ondo-ui will preserve that API and documentation
model rather than invent a different root component.

The registry checker requires every public item to ship
`components/ui/<name>.tsx`. `components/ui/date-picker.tsx` will therefore be
an installable composition entry point that re-exports the Calendar, Popover,
Button, Field, Input, and Input Group parts used by the documented examples.
It will not introduce a `DatePicker` component or hidden state abstraction.
Consumers can either use that entry point or import the individual parts from
their established ondo-ui paths, as the upstream usage documentation shows.

The registry entry is `registry:ui` and lists only
`components/ui/date-picker.tsx`. Its registry dependencies include the OnDo
components the entry point re-exports. Runtime dependencies are restricted to
the packages imported by the entry point; individual examples add `chrono-node`
for natural-language parsing as a direct project dependency.

## Examples

Each example is a client component and preserves upstream state ownership,
calendar selection modes, keyboard handling, positioning, and user-visible
behavior. Mechanical adaptations are limited to:

- OnDo import paths and `@tabler/icons-react` icon equivalents.
- Existing Base UI `render` props for triggers.
- Existing OnDo `Field`, `InputGroup`, and Calendar implementations.
- A static Arabic RTL demonstration in place of the upstream site-only language
  selector, while retaining right-to-left direction and Arabic DayPicker/date-fns
  locale behavior.

The natural-language example keeps upstream `chrono-node` parsing and installs
that package directly. The remaining examples use already-installed `date-fns`
and `react-day-picker` dependencies.

## Documentation

The English page preserves the upstream frontmatter intent, section order,
composition explanation, installation guidance, usage example, and all eight
previews. `styleName="base-nova"` is removed because OnDo previews have one
base style. Internal links are adapted to OnDo component routes.

The Korean page has identical structure, preview order, code identifiers, and
API names. Every explanatory paragraph, section title, and user-visible string
in illustrative code is translated naturally into Korean; package names,
import paths, prop names, and values remain unchanged.

## Registration and Release

Date Picker is registered alphabetically in all required locations:

1. `components/ui/date-picker.tsx`
2. Date Picker demo files and `components/demos/index.tsx`
3. English and Korean component docs
4. Component docs sidebar metadata
5. `registry.json`
6. `/components` gallery metadata
7. Design Inspector catalog

As a new public registry item, it receives a minor Changeset and bilingual
website changelog entries for `v1.7.0`. The package version remains owned by
the Changesets release workflow.

## Verification

Verification covers the registration checker for Date Picker and all
components, focused Date Picker demo and docs checks, the full Bun suite,
TypeScript, ESLint for touched files, registry build, and production build. The
generated registry item is inspected to ensure it contains only the Date Picker
entry point plus the declared dependencies.

Visual QA checks all eight previews at desktop and mobile widths in light and
dark modes. It also checks opening/closing the popover, single and range
selection, input keyboard opening, natural-language parsing, date-of-birth
close-on-select behavior, and RTL layout direction.
