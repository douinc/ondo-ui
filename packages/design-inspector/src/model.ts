export const INSPECTOR_OPEN_PARAM = "__ondo_inspector"
export const INSPECTOR_FRAME_PARAM = "__ondo_inspector_frame"
export const INSPECTOR_SHORTCUT_DELAY = 400
export const INSPECTOR_SETTINGS_STORAGE_KEY = "ondo-design-inspector-settings"

export const VIEWPORT_PRESETS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  fhd: { width: 1920, height: 1080 },
  qhd: { width: 2560, height: 1440 },
} as const

export type ViewportId = keyof typeof VIEWPORT_PRESETS
export type InspectorViewportMode = ViewportId | "compare"
export type InspectorViewportShortcut = "previous" | "next"
export type InspectableKind = "component" | "composition"
export type InspectorStatus = "visible" | "hidden" | "absent"
export type InspectorLocale = "en" | "ko"
export type InspectorShortcut = "toggle-inspector" | "toggle-layers"
export type InspectorScreenshotShortcut = "open-screenshot"
export type InspectorPreferenceShortcut =
  "cycle-theme" | "cycle-desktop-os" | "cycle-locale"
export type InspectorDesktopOs = "macos" | "windows" | "ubuntu"
export type InspectorTheme = "system" | "light" | "dark"
export type InspectorColorScheme = "light" | "dark"

export type InspectorSettings = {
  desktopOs: InspectorDesktopOs
  locale: InspectorLocale
  theme: InspectorTheme
}

export const INSPECTOR_VIEWPORT_MODES: readonly InspectorViewportMode[] = [
  "mobile",
  "tablet",
  "fhd",
  "qhd",
  "compare",
]

export type InspectorInstance = {
  id: string
  kind: InspectableKind
  name: string
  props: Record<string, string>
  visible: boolean
}

export type InspectorGroup = {
  key: `${InspectableKind}:${string}`
  kind: InspectableKind
  name: string
  instances: InspectorInstance[]
}

export type InspectorPageLink = {
  href: string
  label: string
}

function isInspectorDesktopOs(value: unknown): value is InspectorDesktopOs {
  return value === "macos" || value === "windows" || value === "ubuntu"
}

function isInspectorLocale(value: unknown): value is InspectorLocale {
  return value === "en" || value === "ko"
}

export function isInspectorTheme(value: unknown): value is InspectorTheme {
  return value === "system" || value === "light" || value === "dark"
}

export function parseInspectorSettings(
  value: string | null,
  fallback: InspectorSettings
): InspectorSettings {
  if (!value) return { ...fallback }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown> | null
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      return { ...fallback }
    }

    return {
      desktopOs: isInspectorDesktopOs(parsed.desktopOs)
        ? parsed.desktopOs
        : fallback.desktopOs,
      locale: isInspectorLocale(parsed.locale)
        ? parsed.locale
        : fallback.locale,
      theme: isInspectorTheme(parsed.theme) ? parsed.theme : fallback.theme,
    }
  } catch {
    return { ...fallback }
  }
}

const LEGACY_PRESENTATION_ATTRIBUTES = [
  "align",
  "active",
  "dense",
  "fill",
  "hidden",
  "mode",
  "orientation",
  "os",
  "placement",
  "shape",
  "side",
  "size",
  "spacing",
  "stacked",
  "tone",
  "variant",
] as const

export function buildInspectorFrameUrl(
  target: string,
  currentOrigin: string
): string {
  const value = target.trim()
  const origin = new URL(currentOrigin).origin

  if (!value || value.startsWith("//")) {
    throw new Error("Enter a same-origin page path.")
  }

  const url = new URL(value, origin)

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.origin !== origin ||
    url.username ||
    url.password
  ) {
    throw new Error("Design Inspector only opens same-origin pages.")
  }

  url.searchParams.delete(INSPECTOR_OPEN_PARAM)
  url.searchParams.delete(INSPECTOR_FRAME_PARAM)
  url.searchParams.set(INSPECTOR_FRAME_PARAM, "1")

  return url.href
}

export function normalizeInspectorPageHref(
  target: string,
  currentOrigin: string
): string {
  const url = new URL(buildInspectorFrameUrl(target, currentOrigin))
  url.searchParams.delete(INSPECTOR_FRAME_PARAM)
  url.hash = ""

  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "")
  return `${pathname}${url.search}`
}

/**
 * Rewrites a pushState/replaceState `url` argument so it always carries the
 * inspector frame marker. Used to keep a same-origin document identifying
 * itself as framed no matter how many times its own scripts — including a
 * framework router re-asserting its URL after hydration — rewrite the URL.
 * `null`/`undefined` (meaning "keep the current URL") and malformed input
 * pass through unchanged.
 */
export function preserveInspectorFrameMarker(
  url: string | URL | null | undefined,
  baseHref: string
): string | URL | null | undefined {
  if (url === undefined || url === null) return url

  try {
    const resolved = new URL(url, baseHref)
    if (resolved.searchParams.get(INSPECTOR_FRAME_PARAM) === "1") return url

    resolved.searchParams.set(INSPECTOR_FRAME_PARAM, "1")
    return resolved.href
  } catch {
    return url
  }
}

export function mergeInspectorPages(
  ...collections: InspectorPageLink[][]
): InspectorPageLink[] {
  const pages = new Map<string, InspectorPageLink>()

  for (const collection of collections) {
    for (const page of collection) {
      if (!page.href) continue

      const label = page.label.trim() || page.href
      const existing = pages.get(page.href)
      if (!existing) {
        pages.set(page.href, { href: page.href, label })
      } else if (existing.label === existing.href && label !== page.href) {
        pages.set(page.href, { href: page.href, label })
      }
    }
  }

  return [...pages.values()]
}

export function resolveInspectorLocale(
  language: string | undefined,
  pageHref: string,
  fallback: InspectorLocale
): InspectorLocale {
  const normalizedLanguage = language?.trim().toLowerCase().replaceAll("_", "-")

  if (normalizedLanguage === "ko" || normalizedLanguage?.startsWith("ko-")) {
    return "ko"
  }
  if (normalizedLanguage === "en" || normalizedLanguage?.startsWith("en-")) {
    return "en"
  }

  try {
    const pathname = new URL(pageHref, "https://ondo.local").pathname
    const localeSegment = pathname.split("/").filter(Boolean)[0]
    if (localeSegment === "ko" || localeSegment === "en") {
      return localeSegment
    }
  } catch {
    return fallback
  }

  return fallback
}

export const ONDO_DOCS_BASE_URL = "https://ui.ondo.dou.so"

export function buildInspectorDocsHref(
  locale: InspectorLocale,
  kind: InspectableKind,
  name: string
): string {
  const localePrefix = locale === "ko" ? "/ko" : ""
  const category = kind === "component" ? "components" : "compositions"
  return `${ONDO_DOCS_BASE_URL}${localePrefix}/docs/${category}/${encodeURIComponent(name)}`
}

export function createInspectorShortcutDetector(
  delay = INSPECTOR_SHORTCUT_DELAY
): (key: string, pressedAt?: number) => InspectorShortcut | undefined {
  let previousKey: "Shift" | "Alt" | undefined
  let previousPressedAt = 0

  return (key, pressedAt = Date.now()) => {
    const shortcutKey = key === "Shift" || key === "Alt" ? key : undefined

    if (!shortcutKey || !Number.isFinite(pressedAt)) {
      previousKey = undefined
      previousPressedAt = 0
      return undefined
    }

    const isDoublePress =
      previousKey === shortcutKey &&
      pressedAt >= previousPressedAt &&
      pressedAt - previousPressedAt <= delay

    if (!isDoublePress) {
      previousKey = shortcutKey
      previousPressedAt = pressedAt
      return undefined
    }

    previousKey = undefined
    previousPressedAt = 0
    return shortcutKey === "Shift" ? "toggle-inspector" : "toggle-layers"
  }
}

export function resolveInspectorPreferenceShortcut(
  code: string,
  modifiers: {
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
  }
): InspectorPreferenceShortcut | undefined {
  if (
    !modifiers.altKey ||
    modifiers.ctrlKey ||
    modifiers.metaKey ||
    modifiers.shiftKey
  ) {
    return undefined
  }

  if (code === "KeyT") return "cycle-theme"
  if (code === "KeyO") return "cycle-desktop-os"
  if (code === "KeyL") return "cycle-locale"
  return undefined
}

export function resolveInspectorScreenshotShortcut(
  code: string,
  modifiers: {
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
  }
): InspectorScreenshotShortcut | undefined {
  if (
    code !== "KeyS" ||
    !modifiers.altKey ||
    modifiers.ctrlKey ||
    modifiers.metaKey ||
    modifiers.shiftKey
  ) {
    return undefined
  }

  return "open-screenshot"
}

export function resolveInspectorViewportShortcut(
  code: string,
  modifiers: {
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
  }
): InspectorViewportShortcut | undefined {
  if (
    !modifiers.altKey ||
    modifiers.ctrlKey ||
    modifiers.metaKey ||
    modifiers.shiftKey
  ) {
    return undefined
  }

  if (code === "ArrowLeft") return "previous"
  if (code === "ArrowRight") return "next"
  return undefined
}

export function getAdjacentInspectorViewportMode(
  current: InspectorViewportMode,
  direction: InspectorViewportShortcut
): InspectorViewportMode {
  const currentIndex = INSPECTOR_VIEWPORT_MODES.indexOf(current)
  const offset = direction === "previous" ? -1 : 1
  const nextIndex =
    (currentIndex + offset + INSPECTOR_VIEWPORT_MODES.length) %
    INSPECTOR_VIEWPORT_MODES.length

  return INSPECTOR_VIEWPORT_MODES[nextIndex] ?? "mobile"
}

export function usesMacShortcutGlyph(platform: string): boolean {
  return /mac|iphone|ipad|ipod/i.test(platform)
}

export function extractPresentationProps(
  attributes: Record<string, string | undefined>,
  presentationAttributes: readonly string[] = []
): Record<string, string> {
  const result: Record<string, string> = {}
  const attributeNames = new Set([
    ...LEGACY_PRESENTATION_ATTRIBUTES,
    ...presentationAttributes,
  ])

  for (const name of attributeNames) {
    const value = attributes[`data-${name}`]
    if (value !== undefined && result[name] === undefined) {
      result[name] = value
    }
  }

  return Object.fromEntries(
    Object.entries(result).sort(([left], [right]) => left.localeCompare(right))
  )
}

export function areInspectorInstancesEqual(
  left: InspectorInstance[],
  right: InspectorInstance[]
): boolean {
  return (
    left.length === right.length &&
    left.every((instance, index) => {
      const candidate = right[index]
      if (
        candidate?.id !== instance.id ||
        candidate.kind !== instance.kind ||
        candidate.name !== instance.name ||
        candidate.visible !== instance.visible
      ) {
        return false
      }

      const propNames = Object.keys(instance.props)
      return (
        propNames.length === Object.keys(candidate.props).length &&
        propNames.every(
          (name) => candidate.props[name] === instance.props[name]
        )
      )
    })
  )
}

export function groupInspectorInstances(
  instances: InspectorInstance[]
): InspectorGroup[] {
  const groups = new Map<string, InspectorGroup>()

  for (const instance of instances) {
    const key = `${instance.kind}:${instance.name}` as const
    const group = groups.get(key)

    if (group) {
      group.instances.push(instance)
    } else {
      groups.set(key, {
        key,
        kind: instance.kind,
        name: instance.name,
        instances: [instance],
      })
    }
  }

  return [...groups.values()].sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === "component" ? -1 : 1
    }
    return left.name.localeCompare(right.name)
  })
}

export function summarizeViewportStatus(
  inventories: Record<ViewportId, InspectorInstance[]>
): Record<ViewportId, InspectorStatus> {
  return Object.fromEntries(
    (Object.keys(VIEWPORT_PRESETS) as ViewportId[]).map((viewport) => {
      const instances = inventories[viewport]
      const status: InspectorStatus = instances.some(
        (instance) => instance.visible
      )
        ? "visible"
        : instances.length > 0
          ? "hidden"
          : "absent"

      return [viewport, status]
    })
  ) as Record<ViewportId, InspectorStatus>
}
