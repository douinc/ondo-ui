export const ONDO_REGISTRY_INDEX_URL = "https://ui.ondo.dou.so/r/registry.json"

function hasCompositionPath(item) {
  return Array.isArray(item?.files)
    && item.files.some(
      (file) =>
        typeof file?.path === "string" &&
        file.path.replaceAll("\\", "/").startsWith("components/compositions/")
    )
}

export function classifyRegistryItem(item) {
  if (item?.type === "registry:ui") return "component"
  if (item?.type === "registry:component" && hasCompositionPath(item)) {
    return "composition"
  }
  return null
}

export function getSelectableRegistryItems(registry) {
  const groups = {
    components: [],
    compositions: [],
  }

  if (!Array.isArray(registry?.items)) return groups

  for (const item of registry.items) {
    const category = classifyRegistryItem(item)
    if (category === "component") groups.components.push(item)
    if (category === "composition") groups.compositions.push(item)
  }

  return groups
}

export function normalizeOndoItemAddress(item) {
  if (typeof item !== "string") {
    throw new TypeError("Registry item names must be strings")
  }

  if (/^(?:@|https?:\/\/|\.\.?\/)/.test(item)) return item
  return `@ondo-ui/${item}`
}

function toChoice(item) {
  const description =
    typeof item.description === "string" ? item.description.trim() : ""

  return {
    title: description ? `${item.name} — ${description}` : item.name,
    value: item.name,
  }
}

export function buildRegistryChoices(registry) {
  const { components, compositions } = getSelectableRegistryItems(registry)
  const choices = []

  if (components.length > 0) {
    choices.push({
      title: "Components",
      value: "__group_components",
      disabled: true,
    })
    choices.push(...components.map(toChoice))
  }

  if (compositions.length > 0) {
    choices.push({
      title: "Compositions",
      value: "__group_compositions",
      disabled: true,
    })
    choices.push(...compositions.map(toChoice))
  }

  return choices
}
