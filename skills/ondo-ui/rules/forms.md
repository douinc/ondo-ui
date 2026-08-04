# Forms and Inputs

Compose forms with Ondo field primitives so labels, descriptions, validation, orientation, and spacing remain consistent.

## Field structure

**Incorrect:** use anonymous layout wrappers for related controls.

```tsx
<div className="flex flex-col gap-4">
  <Input placeholder="Name" />
  <Textarea placeholder="Bio" />
</div>
```

**Correct:** use `FieldGroup`, `Field`, labels, and descriptions.

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">Name</FieldLabel>
    <Input id="name" autoComplete="name" />
  </Field>
  <Field>
    <FieldLabel htmlFor="bio">Bio</FieldLabel>
    <Textarea id="bio" />
    <FieldDescription>Shown on your public profile.</FieldDescription>
  </Field>
</FieldGroup>
```

Group related checkboxes, radios, or switches with `FieldSet` and `FieldLegend`, then place their `Field` rows inside `FieldGroup`.

```tsx
<FieldSet>
  <FieldLegend variant="label">Notifications</FieldLegend>
  <FieldGroup>{/* related Field rows */}</FieldGroup>
</FieldSet>
```

## InputGroup controls

**Incorrect:** place raw `Input` or `Textarea` inside `InputGroup`.

```tsx
<InputGroup><Input placeholder="Search" /></InputGroup>
```

**Correct:** use `InputGroupInput` or `InputGroupTextarea`; put actions in `InputGroupAddon`.

```tsx
<InputGroup>
  <InputGroupInput placeholder="Search" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Search">
      <IconSearch />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Validation

**Incorrect:** communicate an error only with color or helper text.

```tsx
<Field><Input id="email" /><FieldError>Invalid email.</FieldError></Field>
```

**Correct:** set `data-invalid` on `Field` and `aria-invalid` on the control. Use `FieldError` for the message.

```tsx
<Field data-invalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" aria-invalid />
  <FieldError>Enter a valid email address.</FieldError>
</Field>
```

Use `data-disabled` with the control's `disabled` prop for disabled fields. Keep a programmatic label for every input, including visually hidden labels.
