export const ONDO_COMPONENT_NAMES = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "attachment",
  "avatar",
  "badge",
  "breadcrumb",
  "bubble",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "date-picker",
  "desktop-window",
  "dialog",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "frame",
  "heading",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "live-waveform",
  "marker",
  "menubar",
  "message",
  "message-scroller",
  "meter",
  "meter-ring",
  "native-select",
  "navigation-menu",
  "number-count",
  "pagination",
  "popover",
  "progress",
  "progress-ring",
  "questionnaire",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "spinner",
  "stepper",
  "switch",
  "table",
  "tabs",
  "textarea",
  "timeline",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

export const ONDO_COMPOSITION_NAMES = ["empty-view", "number-badge"] as const

export type InspectorRegistryEntry = {
  name: string
  slots: readonly string[]
  docsPath?: string
  presentationAttributes?: readonly string[]
}

export type InspectorRegistry = {
  components: readonly InspectorRegistryEntry[]
  compositions?: readonly InspectorRegistryEntry[]
}

// Components whose root renders no DOM element expose an additional root
// slot that stands in for the component in the rendered tree.
const EXTRA_ROOT_SLOTS: Partial<
  Record<(typeof ONDO_COMPONENT_NAMES)[number], readonly string[]>
> = {
  combobox: ["combobox-trigger"],
  "dropdown-menu": ["dropdown-menu-trigger"],
  resizable: ["resizable-panel-group"],
  select: ["select-trigger"],
}

export const ONDO_INSPECTOR_REGISTRY: InspectorRegistry = {
  components: ONDO_COMPONENT_NAMES.map((name) => ({
    name,
    slots: [name, ...(EXTRA_ROOT_SLOTS[name] ?? [])],
  })),
  compositions: ONDO_COMPOSITION_NAMES.map((name) => ({
    name,
    slots: [name],
  })),
}

export const ondoRegistry = ONDO_INSPECTOR_REGISTRY

function findRegistryEntry(
  registry: InspectorRegistry | undefined,
  slot: string | undefined,
  kind: "component" | "composition"
): InspectorRegistryEntry | undefined {
  if (!registry || !slot) return undefined
  const entries =
    kind === "component" ? registry.components : (registry.compositions ?? [])
  return entries.find((entry) => entry.slots.includes(slot))
}

function isInspectorName(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function resolveComponentName(
  explicitName: string | undefined,
  slot: string | undefined,
  registry?: InspectorRegistry
): string | undefined {
  if (explicitName && isInspectorName(explicitName)) return explicitName

  for (const source of [registry, ONDO_INSPECTOR_REGISTRY]) {
    const registered = findRegistryEntry(source, slot, "component")
    if (registered && isInspectorName(registered.name)) return registered.name
  }

  return undefined
}

export function resolveCompositionName(
  explicitName: string | undefined,
  registry?: InspectorRegistry
): string | undefined {
  for (const source of [registry, ONDO_INSPECTOR_REGISTRY]) {
    const registered = findRegistryEntry(source, explicitName, "composition")
    if (registered && isInspectorName(registered.name)) return registered.name
  }

  return undefined
}
