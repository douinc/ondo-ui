# Base UI APIs

Ondo is a Base UI registry. Use its `render` composition model and Base UI value shapes.

## Composition and native elements

**Incorrect:** wrapping a trigger or using an unsupported slot prop.

```tsx
<DialogTrigger>
  <Button>Open</Button>
</DialogTrigger>
```

**Correct:** pass the rendered component directly.

```tsx
<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>

<Button render={<a href="/docs" />} nativeButton={false}>
  Read the docs
</Button>
```

When `render` changes a button-like primitive to a non-button element such as `a` or `span`, set `nativeButton={false}`. Keep native button behavior when rendering another `Button`.

## Select items and placeholder

**Incorrect:** omit the root item collection.

```tsx
<Select>
  <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
</Select>
```

**Correct:** pass the same item array to `Select` and render its items inside `SelectGroup`.

```tsx
const items = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
]

<Select items={items}>
  <SelectTrigger>
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
```

## ToggleGroup and Slider values

**Incorrect:** use a string value for a ToggleGroup or a one-element array for a single-thumb Slider.

```tsx
<ToggleGroup defaultValue="daily" />
<Slider defaultValue={[50]} />
```

**Correct:** ToggleGroup values are arrays; `multiple` enables multi-selection. A single Slider thumb uses a scalar, while a range uses an array.

```tsx
<ToggleGroup defaultValue={["daily"]}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup multiple defaultValue={["bold", "italic"]}>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>

<Slider defaultValue={50} max={100} />
<Slider defaultValue={[25, 75]} max={100} />
```

## Accessible overlays

**Incorrect:** render content without the primitive title.

```tsx
<DialogContent><ProfileForm /></DialogContent>
```

**Correct:** every `Dialog`, `Sheet`, `Drawer`, and `AlertDialog` content tree includes its matching title. Hide it with `sr-only` only when another visible heading communicates the same name.

```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Edit profile</DialogTitle>
    <DialogDescription>Update your public details.</DialogDescription>
  </DialogHeader>
  <ProfileForm />
</DialogContent>
```
