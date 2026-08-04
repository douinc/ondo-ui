# Component Composition

Select existing Ondo Components and Compositions before building equivalent markup.

## Keep items in their groups

**Incorrect:** render item primitives directly in a content container.

```tsx
<SelectContent><SelectItem value="one">One</SelectItem></SelectContent>
```

**Correct:** use the matching group.

```tsx
<SelectContent>
  <SelectGroup>
    <SelectItem value="one">One</SelectItem>
  </SelectGroup>
</SelectContent>
```

Apply the same structure to `DropdownMenuGroup`, `ContextMenuGroup`, `MenubarGroup`, `CommandGroup`, `MessageGroup`, `BubbleGroup`, and `AttachmentGroup`. Place `MessageScrollerItem` inside `MessageScrollerContent`.

## Use complete components

**Incorrect:** rebuild cards, callouts, empty states, or status pills from styled divs and spans.

```tsx
<div className="rounded-xl border p-6"><h3>Revenue</h3><p>{value}</p></div>
```

**Correct:** preserve the component's full composition.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
    <CardDescription>Current billing period</CardDescription>
    <CardAction><Badge variant="success">+12%</Badge></CardAction>
  </CardHeader>
  <CardContent><NumberCount value={value} /></CardContent>
  <CardFooter>Updated just now</CardFooter>
</Card>
```

- Use `Alert`, `AlertTitle`, and `AlertDescription` for callouts.
- Use `Empty` with `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent` for custom empty layouts.
- Prefer the `EmptyView` Composition for the standard icon, copy, and actions pattern.
- Prefer the `NumberBadge` Composition when a count annotates another element; compose `Badge` and `NumberCount` directly when its placement or cap behavior does not fit.
- Use `Skeleton` for loading placeholders, `Separator` instead of raw `hr` or border-only divs, and `Badge` instead of custom status spans.

## Accessibility and structure

**Incorrect:** omit fallbacks, overlay titles, or the tab list.

```tsx
<Avatar><AvatarImage src={user.image} /></Avatar>
<Tabs><TabsTrigger value="profile">Profile</TabsTrigger></Tabs>
```

**Correct:** include `AvatarFallback`, matching overlay titles, and `TabsList`.

```tsx
<Avatar>
  <AvatarImage src={user.image} alt={user.name} />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

<Tabs defaultValue="profile">
  <TabsList><TabsTrigger value="profile">Profile</TabsTrigger></TabsList>
  <TabsContent value="profile">...</TabsContent>
</Tabs>
```

Every `Dialog`, `Sheet`, `Drawer`, and `AlertDialog` content includes its matching title.

