# Stepper Variant Design

## Goal

Centralize Stepper state colors in a public variant API so demos do not repeat
state-specific Tailwind color classes.

## Public API

`primary` is an implementation token and is not exposed as a public variant
name. The public variant names are:

```ts
type StepperVariant = "default" | "info" | "success" | "warning" | "destructive"
```

The type is exported from the Stepper module.

`Stepper` accepts:

```ts
variant?: StepperVariant
activeVariant?: StepperVariant
```

Defaults:

- `variant` defaults to `"default"`.
- `activeVariant` defaults to the value of `variant`.

Examples:

```tsx
<Stepper variant="default" />
```

The active and completed indicators both use the `primary` token. The other
variants map to their corresponding Ondo UI color tokens in this order:
`info`, `success`, `warning`, and `destructive`.

```tsx
<Stepper variant="success" />
```

The active and completed indicators both use the `success` token.

```tsx
<Stepper variant="success" activeVariant="default" />
```

The active indicator uses `primary`, while completed indicators use `success`.

Inactive indicators remain muted and are not affected by `activeVariant`.

## Ownership and styling

`Stepper` owns the variant values and passes them through its context. The
visual primitives consume that context:

- `StepperIndicator` applies the active and completed color classes.
- `StepperSeparator` applies the completed/base variant color.
- `StepperTitle` and `StepperDescription` continue to expose state data
  attributes without adding color policy.

The variant recipes should use `cva` and `cn`, following the repository's
component convention. `default` maps to the existing `primary` token; no public
class or type should use `primary` as a Stepper variant name.
The `default` variant uses `text-primary-foreground`; the other semantic
variants use `text-white`. No `*-foreground` theme tokens are added.

The existing size, border, layout, and consumer `className` overrides remain
unchanged. Demos should retain geometry classes but remove direct state color
classes such as `data-[state=completed]:bg-green-500` and
`data-[state=active]:bg-primary`.

## Compatibility

Existing usages without a `variant` prop retain the component's current visual
behavior: active and completed use `primary`, and inactive uses muted styling.
The change adds optional props and does not rename existing components.

## Tests and verification

Add focused tests that verify:

1. The default variant renders the primary active and completed recipes.
2. Each of the `info`, `success`, `warning`, and `destructive` variants renders
   its corresponding active, completed, and separator recipes.
3. `activeVariant="default"` overrides only the active recipe.
4. Existing controlled state, loading indicators, panel rendering, and unique
   IDs continue to pass.

Update both the rendered demos and the documentation examples:

- `components/demos/stepper-*.tsx` files that currently contain raw green or
  state-specific primary color classes should move that policy to the root
  props. To preserve their current appearance, use
  `variant="success" activeVariant="default"`; active remains primary while
  completed is success.
- `content/docs/components/stepper.mdx` and
  `content/docs/components/stepper.ko.mdx` code examples must use the same
  `variant` and `activeVariant` API where they demonstrate state colors. They
  must not teach consumers to write raw `bg-green-500` or state-specific color
  overrides.

The rendered demos and the fenced documentation examples do not need to be
byte-for-byte identical, but both must describe the new public API. Run the
focused Stepper test, typecheck, lint, the registration checker, and the
repository build before completion.
