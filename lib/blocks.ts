export type BlockCategory = (typeof BLOCK_CATEGORIES)[number]["slug"]
export type BlockViewport = keyof typeof BLOCK_VIEWPORTS

export type BlockFile = {
  path: string
  type: string
  target?: string
}

export type BlockItem = {
  name: string
  type: "registry:block"
  description?: string
  categories?: readonly string[]
  files: readonly BlockFile[]
  meta?: {
    iframeHeight?: string
  }
}

type RegistryCatalogItem = {
  name: string
  type: string
  description?: string
  categories?: readonly string[]
  files: readonly BlockFile[]
  meta?: {
    iframeHeight?: string
  }
}

export const FEATURED_BLOCK_NAMES = ["agent-workspace-01"] as const

export const BLOCK_CATEGORIES = [
  { name: { en: "AI", ko: "AI" }, slug: "ai" },
  { name: { en: "Workspace", ko: "워크스페이스" }, slug: "workspace" },
] as const

export const BLOCK_VIEWPORTS = {
  desktop: "100%",
  tablet: "60%",
  mobile: "30%",
} as const

function isBlockItem(item: RegistryCatalogItem): item is BlockItem {
  return item.type === "registry:block"
}

export function listBlockItems(
  items: readonly RegistryCatalogItem[],
  category?: string
) {
  return items.filter(
    (item): item is BlockItem =>
      isBlockItem(item) &&
      (category === undefined || item.categories?.includes(category) === true)
  )
}

export function getBlockItem(
  items: readonly RegistryCatalogItem[],
  name: string
) {
  return listBlockItems(items).find((item) => item.name === name)
}

export function getBlockNameStaticParams(
  items: readonly RegistryCatalogItem[]
) {
  return listBlockItems(items).map(({ name }) => ({ name }))
}

export function getBlockCategoryStaticParams() {
  return BLOCK_CATEGORIES.map(({ slug }) => ({ category: slug }))
}

export function getBlockInstallCommand(name: string) {
  return `npx shadcn@latest add @ondo-ui/${name}`
}

export function getBlockPreviewUrl(name: string) {
  return `/view/${name}/`
}

export function getBlockScreenshotUrl(name: string, theme: "light" | "dark") {
  return `/r/styles/base-vega/${name}-${theme}.png`
}

export function getBlockSourceLanguage(path: string) {
  const normalizedPath = path.toLowerCase()

  if (normalizedPath.endsWith(".tsx")) return "tsx"
  if (normalizedPath.endsWith(".ts")) return "ts"
  if (normalizedPath.endsWith(".json")) return "json"
  if (normalizedPath.endsWith(".css")) return "css"

  return "text"
}
