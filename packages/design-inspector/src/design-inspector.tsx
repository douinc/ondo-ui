"use client"

import * as React from "react"
import {
  IconCamera,
  IconCameraCheck,
  IconCameraX,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconExternalLink,
  IconFile,
  IconFrame,
  IconKeyboard,
  IconLanguage,
  IconLayersIntersect,
  IconLayoutGrid,
  IconLoader2,
  IconMoon,
  IconRefresh,
  IconScan,
  IconSearch,
  IconSun,
  IconWindow,
  IconX,
} from "@tabler/icons-react"
import {
  ONDO_INSPECTOR_REGISTRY,
  type InspectorRegistry,
} from "./catalog"
import {
  areInspectorInstancesEqual,
  buildInspectorDocsHref,
  buildInspectorFrameUrl,
  createInspectorShortcutDetector,
  getAdjacentInspectorViewportMode,
  groupInspectorInstances,
  INSPECTOR_FRAME_PARAM,
  INSPECTOR_OPEN_PARAM,
  INSPECTOR_SETTINGS_STORAGE_KEY,
  isInspectorTheme,
  mergeInspectorPages,
  normalizeInspectorPageHref,
  parseInspectorSettings,
  resolveInspectorPreferenceShortcut,
  resolveInspectorScreenshotShortcut,
  resolveInspectorViewportShortcut,
  summarizeViewportStatus,
  usesMacShortcutGlyph,
  VIEWPORT_PRESETS,
  type InspectableKind,
  type InspectorColorScheme,
  type InspectorDesktopOs,
  type InspectorGroup,
  type InspectorInstance,
  type InspectorLocale,
  type InspectorPageLink,
  type InspectorSettings,
  type InspectorStatus,
  type InspectorTheme,
  type InspectorViewportMode,
  type InspectorViewportShortcut,
  type ViewportId,
} from "./model"
import type { ScannedInspectorInstance } from "./scanner"
import {
  buildInspectorScreenshotFilename,
  downloadInspectorScreenshot,
  type InspectorScreenshotScope,
} from "./screenshot"
import {
  ViewportFrame,
  type ViewportFrameHandle,
} from "./viewport-frame"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Kbd, KbdGroup } from "./ui/kbd"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { cn } from "./lib/utils"

type DesignInspectorLocale = InspectorLocale

type DesignInspectorPage =
  | string
  | {
      href: string
      label?: string
    }

type DesignInspectorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

const LAUNCHER_POSITION_CLASSES: Record<DesignInspectorPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "center-left": "top-1/2 left-4 -translate-y-1/2",
  "center-right": "top-1/2 right-4 -translate-y-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
}

type DesignInspectorProps = {
  /**
   * Replaces the default preview theming, which adds a `light`/`dark` class
   * to each preview document root. Wire this to the theme mechanism the
   * inspected application actually uses.
   */
  applyPreviewTheme?: (document: Document, scheme: InspectorColorScheme) => void
  defaultTheme?: InspectorTheme
  enabled?: boolean
  locale?: DesignInspectorLocale
  onNavigate?: (href: string) => void
  /**
   * Called when the inspector theme control changes. Wire this to the host
   * application's own theme switcher so both stay in sync.
   */
  onThemeChange?: (theme: InspectorTheme, scheme: InspectorColorScheme) => void
  pages?: readonly DesignInspectorPage[]
  /**
   * Places the floating launcher button, on one of eight positions around
   * the viewport edges. Defaults to `bottom-right`.
   */
  position?: DesignInspectorPosition
  registry?: InspectorRegistry
}

type SelectedInstance = {
  id: string
  viewport: ViewportId
}

type InspectorScreenshotStatus = "idle" | "capturing" | "saved" | "error"

type ComparisonGroup = {
  key: `${InspectableKind}:${string}`
  kind: InspectableKind
  name: string
  instances: Record<ViewportId, ScannedInspectorInstance[]>
  status: Record<ViewportId, InspectorStatus>
}

const EMPTY_INVENTORIES = (): Record<
  ViewportId,
  ScannedInspectorInstance[]
> => ({
  mobile: [],
  tablet: [],
  fhd: [],
  qhd: [],
})

const EMPTY_ERRORS = (): Record<ViewportId, string | undefined> => ({
  mobile: undefined,
  tablet: undefined,
  fhd: undefined,
  qhd: undefined,
})

const EMPTY_CONFIGURED_PAGES: readonly DesignInspectorPage[] = []

const VIEWPORT_ICONS = {
  mobile: IconDeviceMobile,
  tablet: IconDeviceTablet,
  fhd: IconDeviceDesktop,
  qhd: IconDeviceDesktop,
} as const

const THEME_ICONS = {
  system: IconDeviceDesktop,
  light: IconSun,
  dark: IconMoon,
} as const

const VIEWPORT_SHORT_LABELS: Record<ViewportId, string> = {
  mobile: "M",
  tablet: "T",
  fhd: "F",
  qhd: "Q",
} as const

const INSPECTOR_THEME_SEQUENCE: readonly InspectorTheme[] = [
  "system",
  "light",
  "dark",
]
const INSPECTOR_DESKTOP_OS_SEQUENCE: readonly InspectorDesktopOs[] = [
  "macos",
  "windows",
  "ubuntu",
]
const INSPECTOR_LOCALE_SEQUENCE: readonly DesignInspectorLocale[] = ["en", "ko"]

function getNextPreference<T>(options: readonly T[], current: T): T {
  const currentIndex = options.indexOf(current)
  return options[(currentIndex + 1) % options.length] ?? current
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false

  const element = target as HTMLElement
  return (
    element.isContentEditable ||
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT"
  )
}

function DoubleAltShortcutHint({ label }: { label: "⌥" | "Alt" }) {
  return (
    <KbdGroup
      aria-hidden="true"
      className="ml-1 hidden items-center gap-0.5 2xl:inline-flex"
    >
      {[0, 1].map((index) => (
        <Kbd
          key={index}
          className="h-4 min-w-4 bg-background/70 px-0.5 text-[9px]"
        >
          {label}
        </Kbd>
      ))}
    </KbdGroup>
  )
}

function ShortcutKeys({
  className,
  keys,
}: {
  className?: string
  keys: readonly string[]
}) {
  return (
    <KbdGroup className={className}>
      {keys.map((key, index) => (
        <Kbd key={`${key}:${index}`}>{key}</Kbd>
      ))}
    </KbdGroup>
  )
}

function InspectorControlTooltip({
  children,
  keys,
  label,
}: {
  children: React.ReactNode
  keys?: readonly string[]
  label: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={8}
        data-inspector-ui=""
      >
        <span>{label}</span>
        {keys?.length ? <ShortcutKeys keys={keys} /> : null}
      </TooltipContent>
    </Tooltip>
  )
}

const COPY = {
  en: {
    absent: "Absent",
    close: "Close inspector",
    compare: "Compare",
    component: "Component",
    components: "Components",
    composition: "Composition",
    compositions: "Compositions",
    componentLayers: "Component layers",
    dark: "Dark",
    defaultProps: "No exposed variant props",
    desktopOs: "Desktop OS",
    docs: "Docs",
    english: "English",
    errorLabel: "This page could not be inspected.",
    fhd: "FHD",
    hidden: "Hidden",
    inspect: "Inspect",
    inspectionError: "Could not inspect this page.",
    inspectorTools: "Inspector tools",
    instance: "Instance",
    invalidPath: "Enter a valid same-origin page path.",
    inventoryEmpty: "No Ondo component markers were found in this viewport.",
    korean: "한국어",
    keyboardShortcuts: "Keyboard shortcuts",
    language: "Language",
    layers: "Layers",
    light: "Light",
    load: "Load page",
    loadingLabel: "Loading viewport…",
    macos: "macOS",
    mobile: "Mobile",
    next: "Next instance",
    nextViewport: "Next viewport",
    pagePath: "Page path",
    pages: "Pages",
    pageSearch: "Search pages",
    pagesEmpty: "No same-origin pages found yet.",
    preferences: "Inspector preferences",
    previous: "Previous instance",
    previousViewport: "Previous viewport",
    qhd: "QHD",
    reload: "Reload viewport",
    sameOriginError: "The page is not available to the same-origin inspector.",
    screenshot: "Screenshot",
    screenshotCapturing: "Capturing screenshot…",
    screenshotFailed: "Could not capture screenshot.",
    screenshotIframe: "iframe only",
    screenshotSaved: "Screenshot saved",
    screenshotWindow: "Include DesktopWindow",
    selected: "Selected",
    system: "System",
    tablet: "Tablet",
    theme: "Theme",
    title: "Design Inspector",
    useShortcutOrSelect: "Select an action or use its shortcut.",
    ubuntu: "Ubuntu",
    viewport: "Viewport",
    visible: "Visible",
    windows: "Windows",
  },
  ko: {
    absent: "없음",
    close: "인스펙터 닫기",
    compare: "비교",
    component: "컴포넌트",
    components: "컴포넌트",
    composition: "조합 컴포넌트",
    compositions: "조합 컴포넌트",
    componentLayers: "컴포넌트 레이어",
    dark: "어둡게",
    defaultProps: "노출된 variant 설정 없음",
    desktopOs: "데스크톱 OS",
    docs: "문서",
    english: "English",
    errorLabel: "이 페이지를 검사할 수 없습니다.",
    fhd: "FHD",
    hidden: "숨김",
    inspect: "검사",
    inspectionError: "페이지를 검사하지 못했습니다.",
    inspectorTools: "인스펙터 도구",
    instance: "인스턴스",
    invalidPath: "같은 origin의 올바른 페이지 경로를 입력하세요.",
    inventoryEmpty: "이 화면에서 Ondo 컴포넌트 표식을 찾지 못했습니다.",
    korean: "한국어",
    keyboardShortcuts: "키보드 단축키",
    language: "언어",
    layers: "레이어",
    light: "밝게",
    load: "페이지 열기",
    loadingLabel: "뷰포트 불러오는 중…",
    macos: "macOS",
    mobile: "모바일",
    next: "다음 인스턴스",
    nextViewport: "다음 뷰포트",
    pagePath: "페이지 경로",
    pages: "페이지",
    pageSearch: "페이지 검색",
    pagesEmpty: "아직 같은 origin의 페이지를 찾지 못했습니다.",
    preferences: "인스펙터 환경설정",
    previous: "이전 인스턴스",
    previousViewport: "이전 뷰포트",
    qhd: "QHD",
    reload: "화면 새로고침",
    sameOriginError: "같은 origin에서 이 페이지를 열 수 없습니다.",
    screenshot: "스크린샷",
    screenshotCapturing: "스크린샷 캡처 중…",
    screenshotFailed: "스크린샷을 만들지 못했습니다.",
    screenshotIframe: "iframe만",
    screenshotSaved: "스크린샷을 저장했습니다",
    screenshotWindow: "DesktopWindow 포함",
    selected: "선택됨",
    system: "시스템",
    tablet: "태블릿",
    theme: "테마",
    title: "디자인 인스펙터",
    useShortcutOrSelect: "명령을 선택하거나 단축키를 사용하세요.",
    ubuntu: "Ubuntu",
    viewport: "뷰포트",
    visible: "표시",
    windows: "Windows",
  },
} as const

function subscribeClient() {
  return () => undefined
}

const SYSTEM_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

function subscribeSystemColorScheme(callback: () => void) {
  const media = window.matchMedia(SYSTEM_COLOR_SCHEME_QUERY)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function getSystemColorScheme(): InspectorColorScheme {
  return window.matchMedia(SYSTEM_COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function getCurrentTarget(): string {
  const url = new URL(window.location.href)
  url.searchParams.delete(INSPECTOR_OPEN_PARAM)
  url.searchParams.delete(INSPECTOR_FRAME_PARAM)
  return `${url.pathname}${url.search}${url.hash}`
}

function titleCase(value: string): string {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")
}

function normalizeConfiguredPages(
  pages: readonly DesignInspectorPage[],
  origin: string
): InspectorPageLink[] {
  const normalized: InspectorPageLink[] = []

  for (const page of pages) {
    const target = typeof page === "string" ? page : page.href

    try {
      const href = normalizeInspectorPageHref(target, origin)
      const label = typeof page === "string" ? href : page.label?.trim() || href
      normalized.push({ href, label })
    } catch {
      continue
    }
  }

  return mergeInspectorPages(normalized)
}

function getInspectorDocsHref(
  locale: DesignInspectorLocale,
  kind: InspectableKind,
  name: string,
  registry: InspectorRegistry
): string {
  const entries =
    kind === "component" ? registry.components : (registry.compositions ?? [])
  return (
    entries.find((entry) => entry.name === name)?.docsPath ??
    buildInspectorDocsHref(locale, kind, name)
  )
}

function areInspectorPagesEqual(
  left: InspectorPageLink[],
  right: InspectorPageLink[]
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (page, index) =>
        page.href === right[index]?.href && page.label === right[index]?.label
    )
  )
}

function buildComparisonGroups(
  inventories: Record<ViewportId, ScannedInspectorInstance[]>
): ComparisonGroup[] {
  const identities = new Map<
    string,
    Pick<ComparisonGroup, "key" | "kind" | "name">
  >()

  for (const viewport of Object.keys(VIEWPORT_PRESETS) as ViewportId[]) {
    for (const group of groupInspectorInstances(inventories[viewport])) {
      identities.set(group.key, {
        key: group.key,
        kind: group.kind,
        name: group.name,
      })
    }
  }

  return [...identities.values()]
    .sort((left, right) => {
      if (left.kind !== right.kind) {
        return left.kind === "component" ? -1 : 1
      }
      return left.name.localeCompare(right.name)
    })
    .map((identity) => {
      const instances = Object.fromEntries(
        (Object.keys(VIEWPORT_PRESETS) as ViewportId[]).map((viewport) => [
          viewport,
          inventories[viewport].filter(
            (instance) =>
              instance.kind === identity.kind && instance.name === identity.name
          ),
        ])
      ) as Record<ViewportId, ScannedInspectorInstance[]>

      return {
        ...identity,
        instances,
        status: summarizeViewportStatus(instances),
      }
    })
}

function summarizeGroupProps(instances: InspectorInstance[]): string {
  const keys = [
    ...new Set(instances.flatMap((instance) => Object.keys(instance.props))),
  ].sort((left, right) => {
    const priority = ["variant", "size"]
    const leftPriority = priority.indexOf(left)
    const rightPriority = priority.indexOf(right)

    if (leftPriority !== -1 || rightPriority !== -1) {
      if (leftPriority === -1) return 1
      if (rightPriority === -1) return -1
      return leftPriority - rightPriority
    }
    return left.localeCompare(right)
  })

  return keys
    .slice(0, 2)
    .map((name) => {
      const values = [
        ...new Set(instances.map((instance) => instance.props[name])),
      ].filter((value) => value !== undefined)
      const visibleValues = values.slice(0, 2).map((value) => value || "true")
      const remaining = values.length - visibleValues.length
      return `${name}=${visibleValues.join("|")}${remaining > 0 ? `|+${remaining}` : ""}`
    })
    .join(" · ")
}

function StatusDot({
  label,
  status,
}: {
  label: string
  status: InspectorStatus
}) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-block size-2 rounded-full",
        status === "visible" && "bg-emerald-500",
        status === "hidden" && "bg-amber-500",
        status === "absent" && "bg-muted-foreground/25"
      )}
    />
  )
}

export function DesignInspector(props: DesignInspectorProps) {
  return (
    <TooltipProvider delay={350}>
      <DesignInspectorContent {...props} />
    </TooltipProvider>
  )
}

function DesignInspectorContent({
  applyPreviewTheme,
  defaultTheme,
  enabled = true,
  locale: defaultLocale = "en",
  onNavigate,
  onThemeChange,
  pages: configuredPages = EMPTY_CONFIGURED_PAGES,
  position = "bottom-right",
  registry = ONDO_INSPECTOR_REGISTRY,
}: DesignInspectorProps) {
  const isClient = React.useSyncExternalStore(
    subscribeClient,
    () => true,
    () => false
  )
  const systemColorScheme = React.useSyncExternalStore(
    subscribeSystemColorScheme,
    getSystemColorScheme,
    () => "light" as const
  )
  const [settings, setSettings] = React.useState<InspectorSettings>({
    desktopOs: "macos",
    locale: defaultLocale,
    theme: "system",
  })
  const [settingsReady, setSettingsReady] = React.useState(false)
  const settingsInitializedRef = React.useRef(false)
  const activeLocale = settings.locale
  const dict = COPY[activeLocale]
  const [isOpen, setIsOpen] = React.useState(false)
  const [layersVisible, setLayersVisible] = React.useState(false)
  const [targetInput, setTargetInput] = React.useState("")
  const [frameUrl, setFrameUrl] = React.useState("")
  const [activePageHref, setActivePageHref] = React.useState("")
  const [knownPages, setKnownPages] = React.useState<InspectorPageLink[]>([])
  const [pathError, setPathError] = React.useState<string>()
  const [activeViewport, setActiveViewport] = React.useState<ViewportId>("fhd")
  const [compare, setCompare] = React.useState(false)
  const [revision, setRevision] = React.useState(0)
  const [inventories, setInventories] = React.useState(EMPTY_INVENTORIES)
  const [errors, setErrors] = React.useState(EMPTY_ERRORS)
  const [selected, setSelected] = React.useState<SelectedInstance>()
  const [screenshotMenuOpen, setScreenshotMenuOpen] = React.useState(false)
  const launcherRef = React.useRef<HTMLButtonElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const wasOpenRef = React.useRef(false)
  const viewportFrameRefs = React.useRef<
    Partial<Record<ViewportId, ViewportFrameHandle>>
  >({})
  const screenshotInProgressRef = React.useRef(false)
  const screenshotFeedbackTimerRef = React.useRef<number | undefined>(undefined)
  const [screenshotStatus, setScreenshotStatus] =
    React.useState<InspectorScreenshotStatus>("idle")
  const [screenshotMessage, setScreenshotMessage] = React.useState("")
  const detectShortcut = React.useMemo(
    () => createInspectorShortcutDetector(),
    []
  )

  const isFrame =
    isClient &&
    new URLSearchParams(window.location.search).get(INSPECTOR_FRAME_PARAM) ===
      "1"

  React.useEffect(() => {
    if (!enabled || !isClient || isFrame || settingsInitializedRef.current) {
      return
    }

    settingsInitializedRef.current = true
    let storedSettings: string | null = null

    try {
      storedSettings = window.localStorage.getItem(
        INSPECTOR_SETTINGS_STORAGE_KEY
      )
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }

    const nextSettings = parseInspectorSettings(storedSettings, {
      desktopOs: "macos",
      locale: defaultLocale,
      theme: isInspectorTheme(defaultTheme) ? defaultTheme : "system",
    })
    setSettings(nextSettings)
    setSettingsReady(true)
  }, [defaultLocale, defaultTheme, enabled, isClient, isFrame])

  const persistSettings = React.useCallback((next: InspectorSettings) => {
    setSettings(next)

    try {
      window.localStorage.setItem(
        INSPECTOR_SETTINGS_STORAGE_KEY,
        JSON.stringify(next)
      )
    } catch {
      // Keep the in-memory preference when localStorage is unavailable.
    }
  }, [])

  const handleDesktopOsChange = React.useCallback(
    (desktopOs: InspectorDesktopOs) => {
      persistSettings({ ...settings, desktopOs })
    },
    [persistSettings, settings]
  )

  const handleLocaleChange = React.useCallback(
    (locale: DesignInspectorLocale) => {
      persistSettings({ ...settings, locale })
      setPathError((current) =>
        current ? COPY[locale].invalidPath : undefined
      )
    },
    [persistSettings, settings]
  )

  const handleThemeChange = React.useCallback(
    (theme: InspectorTheme) => {
      persistSettings({ ...settings, theme })
      onThemeChange?.(theme, theme === "system" ? systemColorScheme : theme)
    },
    [onThemeChange, persistSettings, settings, systemColorScheme]
  )

  const cycleTheme = React.useCallback(() => {
    handleThemeChange(
      getNextPreference(INSPECTOR_THEME_SEQUENCE, settings.theme)
    )
  }, [handleThemeChange, settings.theme])

  const cycleDesktopOs = React.useCallback(() => {
    handleDesktopOsChange(
      getNextPreference(INSPECTOR_DESKTOP_OS_SEQUENCE, settings.desktopOs)
    )
  }, [handleDesktopOsChange, settings.desktopOs])

  const cycleLocale = React.useCallback(() => {
    handleLocaleChange(
      getNextPreference(INSPECTOR_LOCALE_SEQUENCE, settings.locale)
    )
  }, [handleLocaleChange, settings.locale])

  const previewColorScheme: InspectorColorScheme =
    settings.theme === "system" ? systemColorScheme : settings.theme
  const clientPlatform = isClient
    ? window.navigator.platform || window.navigator.userAgent
    : ""
  const usesMacShortcuts = usesMacShortcutGlyph(clientPlatform)
  const altKeyLabel = usesMacShortcuts ? "⌥" : "Alt"
  const shiftKeyLabel = usesMacShortcuts ? "⇧" : "Shift"
  const shortcutModifier = usesMacShortcuts ? "⌥" : "Alt+"
  const viewportShortcutModifier = altKeyLabel

  const configuredPageLinks = React.useMemo(
    () =>
      isClient
        ? normalizeConfiguredPages(configuredPages, window.location.origin)
        : [],
    [configuredPages, isClient]
  )
  const pageLinks = React.useMemo(
    () => mergeInspectorPages(configuredPageLinks, knownPages),
    [configuredPageLinks, knownPages]
  )

  const loadTarget = React.useCallback(
    (target: string, label?: string): boolean => {
      try {
        const href = normalizeInspectorPageHref(target, window.location.origin)
        const url = buildInspectorFrameUrl(href, window.location.origin)
        setFrameUrl(url)
        setTargetInput(href)
        setActivePageHref(href)
        setKnownPages((current) =>
          mergeInspectorPages(current, [{ href, label: label?.trim() || href }])
        )
        setPathError(undefined)
        onNavigate?.(href)
        setInventories(EMPTY_INVENTORIES())
        setErrors(EMPTY_ERRORS())
        setSelected(undefined)
        setRevision((current) => current + 1)
        return true
      } catch {
        setPathError(COPY[activeLocale].invalidPath)
        return false
      }
    },
    [activeLocale, onNavigate]
  )

  const showInspector = React.useCallback(
    (showLayers: boolean) => {
      const target = getCurrentTarget()
      if (loadTarget(target, document.title)) {
        setLayersVisible(showLayers)
        setIsOpen(true)
      }
    },
    [loadTarget]
  )

  const openInspector = React.useCallback(() => {
    showInspector(false)
  }, [showInspector])

  const toggleInspector = React.useCallback(() => {
    if (isOpen) {
      setScreenshotMenuOpen(false)
      setIsOpen(false)
      return
    }
    openInspector()
  }, [isOpen, openInspector])

  const toggleLayers = React.useCallback(() => {
    if (!isOpen) {
      showInspector(true)
      return
    }
    setLayersVisible((current) => !current)
  }, [isOpen, showInspector])

  const selectViewportMode = React.useCallback(
    (mode: InspectorViewportMode) => {
      if (mode === "compare") {
        setCompare(true)
      } else {
        setCompare(false)
        setActiveViewport(mode)
      }
      setSelected(undefined)
    },
    []
  )

  const moveViewport = React.useCallback(
    (direction: InspectorViewportShortcut) => {
      const currentMode: InspectorViewportMode = compare
        ? "compare"
        : activeViewport
      selectViewportMode(
        getAdjacentInspectorViewportMode(currentMode, direction)
      )
    },
    [activeViewport, compare, selectViewportMode]
  )

  const handleShortcutKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing) return

      if (event.key === "Escape" && isOpen && layersVisible && selected) {
        detectShortcut("", Date.now())
        setSelected(undefined)
        event.preventDefault()
        event.stopPropagation()
        return
      }

      const viewportShortcut =
        isOpen && !event.defaultPrevented && !isTypingTarget(event.target)
          ? resolveInspectorViewportShortcut(event.code, event)
          : undefined

      if (viewportShortcut) {
        moveViewport(viewportShortcut)
        detectShortcut("", Date.now())
        event.preventDefault()
        event.stopPropagation()
        return
      }

      const screenshotShortcut =
        isOpen && !event.defaultPrevented && !isTypingTarget(event.target)
          ? resolveInspectorScreenshotShortcut(event.code, event)
          : undefined

      if (screenshotShortcut) {
        setScreenshotMenuOpen(true)
        detectShortcut("", Date.now())
        event.preventDefault()
        event.stopPropagation()
        return
      }

      const preferenceShortcut =
        isOpen && !event.defaultPrevented && !isTypingTarget(event.target)
          ? resolveInspectorPreferenceShortcut(event.code, event)
          : undefined

      if (preferenceShortcut) {
        if (preferenceShortcut === "cycle-theme") {
          cycleTheme()
        } else if (preferenceShortcut === "cycle-desktop-os") {
          cycleDesktopOs()
        } else {
          cycleLocale()
        }

        detectShortcut("", Date.now())
        event.preventDefault()
        return
      }

      const isShift =
        event.key === "Shift" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      const isAlt =
        event.key === "Alt" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !isTypingTarget(event.target)
      const shortcut = detectShortcut(
        !event.defaultPrevented && (isShift || isAlt) ? event.key : "",
        Date.now()
      )

      if (isAlt) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (!shortcut) return
      event.preventDefault()

      if (shortcut === "toggle-inspector") {
        toggleInspector()
      } else {
        toggleLayers()
      }
    },
    [
      cycleDesktopOs,
      cycleLocale,
      cycleTheme,
      detectShortcut,
      isOpen,
      layersVisible,
      moveViewport,
      selected,
      toggleInspector,
      toggleLayers,
    ]
  )

  const reload = React.useCallback(() => {
    setInventories(EMPTY_INVENTORIES())
    setErrors(EMPTY_ERRORS())
    setSelected(undefined)
    setRevision((current) => current + 1)
  }, [])

  const handleScreenshot = React.useCallback(
    async (viewport: ViewportId, scope: InspectorScreenshotScope) => {
      if (screenshotInProgressRef.current) return

      if (screenshotFeedbackTimerRef.current !== undefined) {
        window.clearTimeout(screenshotFeedbackTimerRef.current)
        screenshotFeedbackTimerRef.current = undefined
      }
      const resetFeedbackLater = () => {
        screenshotFeedbackTimerRef.current = window.setTimeout(() => {
          setScreenshotStatus("idle")
          setScreenshotMessage("")
          screenshotFeedbackTimerRef.current = undefined
        }, 2500)
      }

      const frame = viewportFrameRefs.current[viewport]
      if (!frame) {
        setScreenshotStatus("error")
        setScreenshotMessage(dict.screenshotFailed)
        resetFeedbackLater()
        return
      }

      screenshotInProgressRef.current = true
      setScreenshotStatus("capturing")
      setScreenshotMessage(`${dict.screenshotCapturing} · ${dict[viewport]}`)

      try {
        const blob = await frame.captureScreenshot(scope)
        downloadInspectorScreenshot(
          blob,
          buildInspectorScreenshotFilename(
            activePageHref || targetInput || "/",
            viewport,
            scope
          )
        )
        setScreenshotStatus("saved")
        setScreenshotMessage(`${dict.screenshotSaved} · ${dict[viewport]}`)
      } catch {
        setScreenshotStatus("error")
        setScreenshotMessage(dict.screenshotFailed)
      } finally {
        screenshotInProgressRef.current = false
        resetFeedbackLater()
      }
    },
    [activePageHref, dict, targetInput]
  )

  const handleInventory = React.useCallback(
    (viewport: ViewportId, instances: ScannedInspectorInstance[]) => {
      setInventories((current) =>
        areInspectorInstancesEqual(current[viewport], instances)
          ? current
          : { ...current, [viewport]: instances }
      )
    },
    []
  )

  const handleError = React.useCallback(
    (viewport: ViewportId, message?: string) => {
      setErrors((current) => ({ ...current, [viewport]: message }))
    },
    []
  )

  const handlePages = React.useCallback((pages: InspectorPageLink[]) => {
    setKnownPages((current) => {
      const next = mergeInspectorPages(current, pages)
      return areInspectorPagesEqual(current, next) ? current : next
    })
  }, [])

  const handleFrameSelection = React.useCallback(
    (viewport: ViewportId, id: string) => {
      setActiveViewport(viewport)
      setSelected({ id, viewport })
    },
    []
  )

  React.useEffect(() => {
    if (!enabled || !isClient || !settingsReady || isFrame) return
    document.addEventListener("keydown", handleShortcutKeyDown, true)
    return () => {
      document.removeEventListener("keydown", handleShortcutKeyDown, true)
    }
  }, [enabled, handleShortcutKeyDown, isClient, isFrame, settingsReady])

  React.useEffect(() => {
    if (isOpen) {
      overlayRef.current?.focus()
    } else if (wasOpenRef.current) {
      launcherRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        event.isComposing ||
        isTypingTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      setScreenshotMenuOpen(false)
      setIsOpen(false)
    }

    // Bubble phase on window, so open popups — which dismiss on a document
    // keydown listener and prevent the event — consume Escape first.
    window.addEventListener("keydown", handleEscapeKeyDown)
    return () => window.removeEventListener("keydown", handleEscapeKeyDown)
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  React.useEffect(
    () => () => {
      if (screenshotFeedbackTimerRef.current !== undefined) {
        window.clearTimeout(screenshotFeedbackTimerRef.current)
      }
    },
    []
  )

  const activeGroups = React.useMemo(
    () => groupInspectorInstances(inventories[activeViewport]),
    [activeViewport, inventories]
  )
  const comparisonGroups = React.useMemo(
    () => buildComparisonGroups(inventories),
    [inventories]
  )

  const selectedInstance = React.useMemo(
    () =>
      selected
        ? inventories[selected.viewport].find(
            (instance) => instance.id === selected.id
          )
        : undefined,
    [inventories, selected]
  )
  const selectedSiblings = React.useMemo(
    () =>
      selected && selectedInstance
        ? inventories[selected.viewport].filter(
            (instance) =>
              instance.kind === selectedInstance.kind &&
              instance.name === selectedInstance.name
          )
        : [],
    [inventories, selected, selectedInstance]
  )
  const selectedIndex = selectedInstance
    ? selectedSiblings.findIndex(
        (instance) => instance.id === selectedInstance.id
      )
    : -1
  const selectedProps = selectedInstance
    ? Object.entries(selectedInstance.props)
    : []

  const selectGroup = React.useCallback(
    (group: InspectorGroup, viewport: ViewportId) => {
      const instance =
        group.instances.find((candidate) => candidate.visible) ??
        group.instances[0]
      if (instance) setSelected({ id: instance.id, viewport })
    },
    []
  )

  const selectComparisonGroup = React.useCallback((group: ComparisonGroup) => {
    for (const viewport of Object.keys(VIEWPORT_PRESETS) as ViewportId[]) {
      const instance = group.instances[viewport].find(
        (candidate) => candidate.visible
      )
      if (instance) {
        setSelected({ id: instance.id, viewport })
        return
      }
    }

    for (const viewport of Object.keys(VIEWPORT_PRESETS) as ViewportId[]) {
      const instance = group.instances[viewport][0]
      if (instance) {
        setSelected({ id: instance.id, viewport })
        return
      }
    }
  }, [])

  function moveSelection(offset: number) {
    if (!selected || selectedIndex < 0 || selectedSiblings.length === 0) return
    const nextIndex =
      (selectedIndex + offset + selectedSiblings.length) %
      selectedSiblings.length
    setSelected({
      viewport: selected.viewport,
      id: selectedSiblings[nextIndex].id,
    })
  }

  if (!enabled || !isClient || !settingsReady || isFrame) return null

  if (!isOpen) {
    return (
      <span
        data-inspector-ui=""
        className={cn("fixed z-[950]", LAUNCHER_POSITION_CLASSES[position])}
      >
        <Button
          ref={launcherRef}
          type="button"
          variant="outline"
          onClick={openInspector}
          aria-label={`${dict.inspect} (Shift, Shift)`}
          aria-keyshortcuts="Shift Shift"
          className="gap-1.5 rounded-full border bg-background/95 px-4 shadow-lg backdrop-blur"
        >
          <IconScan data-icon="inline-start" />
          {dict.inspect}
          <ShortcutKeys keys={[shiftKeyLabel, shiftKeyLabel]} className="ml-1" />
        </Button>
      </span>
    )
  }

  const visibleViewports = compare
    ? (Object.keys(VIEWPORT_PRESETS) as ViewportId[])
    : [activeViewport]
  const comparisonErrors = (Object.keys(VIEWPORT_PRESETS) as ViewportId[])
    .map((viewport) => ({ viewport, message: errors[viewport] }))
    .filter(
      (entry): entry is { viewport: ViewportId; message: string } =>
        entry.message !== undefined
    )

  return (
    <div
      ref={overlayRef}
      data-slot="design-inspector"
      data-inspector-ui=""
      role="dialog"
      aria-modal="true"
      aria-label={dict.title}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-1000 flex flex-col bg-background text-foreground outline-none",
        previewColorScheme
      )}
      style={{ colorScheme: previewColorScheme }}
    >
      {/* Base UI portals popups to <body> inside a positioner hardcoded to
          z-50, which would land behind this z-1000 overlay. The ui/ copies
          stay identical to the Ondo originals, so the inspector lifts only
          its own positioners — identified by the popup's data-inspector-ui
          marker — from here instead of forking the components. */}
      <style>
        {`:where(:has(> [data-inspector-ui][data-slot="tooltip-content"], > [data-inspector-ui][data-slot="dropdown-menu-content"])) { z-index: 1100 !important; }`}
      </style>
      <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2">
        <div className="mr-2 flex items-center gap-2 font-heading text-sm font-semibold whitespace-nowrap">
          <IconScan className="size-4 text-primary" />
          {dict.title}
        </div>
        <form
          className="flex min-w-64 flex-1 items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            loadTarget(targetInput)
          }}
        >
          <label htmlFor="ondo-inspector-path" className="sr-only">
            {dict.pagePath}
          </label>
          <Input
            id="ondo-inspector-path"
            value={targetInput}
            onChange={(event) => setTargetInput(event.target.value)}
            aria-invalid={!!pathError}
            size="sm"
            className="font-mono"
          />
          <Button type="submit" size="sm">
            {dict.load}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={dict.reload}
            title={dict.reload}
            onClick={reload}
          >
            <IconRefresh />
          </Button>
        </form>
        <Separator
          orientation="vertical"
          className="mx-1 hidden h-6! self-center! md:block"
        />
        <div
          role="toolbar"
          aria-label={dict.inspectorTools}
          className="ml-auto flex max-w-full [scrollbar-width:none] items-center gap-1 overflow-x-auto rounded-lg border bg-muted/30 p-1 shadow-sm [&::-webkit-scrollbar]:hidden"
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <div
                  className="flex items-center gap-1"
                  aria-label={dict.viewport}
                  aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
                />
              }
            >
              {(Object.keys(VIEWPORT_PRESETS) as ViewportId[]).map(
                (viewport) => {
                  const Icon = VIEWPORT_ICONS[viewport]
                  return (
                    <Button
                      key={viewport}
                      type="button"
                      size="sm"
                      variant={
                        !compare && activeViewport === viewport
                          ? "secondary"
                          : "ghost"
                      }
                      aria-label={dict[viewport]}
                      aria-pressed={!compare && activeViewport === viewport}
                      onClick={() => selectViewportMode(viewport)}
                    >
                      <Icon data-icon="inline-start" />
                      <span className="hidden 2xl:inline">
                        {dict[viewport]}
                      </span>
                    </Button>
                  )
                }
              )}
              <Button
                type="button"
                size="sm"
                variant={compare ? "secondary" : "ghost"}
                aria-label={dict.compare}
                aria-pressed={compare}
                onClick={() =>
                  selectViewportMode(compare ? activeViewport : "compare")
                }
              >
                <IconLayoutGrid data-icon="inline-start" />
                <span className="hidden 2xl:inline">{dict.compare}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={8}
              data-inspector-ui=""
            >
              <span>{dict.previousViewport}</span>
              <ShortcutKeys keys={[viewportShortcutModifier, "←"]} />
              <span aria-hidden="true" className="mx-0.5 h-3 w-px bg-border" />
              <span>{dict.nextViewport}</span>
              <ShortcutKeys keys={[viewportShortcutModifier, "→"]} />
            </TooltipContent>
          </Tooltip>

          <InspectorScreenshotMenu
            altKeyLabel={altKeyLabel}
            dict={dict}
            message={screenshotMessage}
            open={screenshotMenuOpen}
            status={screenshotStatus}
            viewports={visibleViewports}
            onCapture={handleScreenshot}
            onOpenChange={setScreenshotMenuOpen}
          />

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-6! self-center! xl:block"
          />

          <InspectorControlTooltip
            label={dict.componentLayers}
            keys={[altKeyLabel, altKeyLabel]}
          >
            <Button
              type="button"
              size="sm"
              variant={layersVisible ? "secondary" : "ghost"}
              aria-label={dict.componentLayers}
              aria-pressed={layersVisible}
              onClick={toggleLayers}
              className="gap-1.5 px-2"
            >
              <IconLayersIntersect data-icon="inline-start" />
              <span className="hidden 2xl:inline">{dict.layers}</span>
              <DoubleAltShortcutHint label={altKeyLabel} />
            </Button>
          </InspectorControlTooltip>

          <InspectorPreferences
            altKeyLabel={altKeyLabel}
            dict={dict}
            settings={settings}
            shortcutModifier={shortcutModifier}
            onDesktopOsChange={handleDesktopOsChange}
            onLocaleChange={handleLocaleChange}
            onThemeChange={handleThemeChange}
          />

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-6! self-center! 2xl:block"
          />

          <InspectorShortcutMenu
            altKeyLabel={altKeyLabel}
            dict={dict}
            settings={settings}
            shiftKeyLabel={shiftKeyLabel}
            onClose={toggleInspector}
            onCycleDesktopOs={cycleDesktopOs}
            onCycleLocale={cycleLocale}
            onCycleTheme={cycleTheme}
            onMoveViewport={moveViewport}
            onOpenScreenshot={() => setScreenshotMenuOpen(true)}
            onToggleLayers={toggleLayers}
          />

          <InspectorControlTooltip
            label={dict.close}
            keys={[shiftKeyLabel, shiftKeyLabel]}
          >
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={dict.close}
              onClick={toggleInspector}
            >
              <IconX />
            </Button>
          </InspectorControlTooltip>
        </div>
        {pathError ? (
          <p className="basis-full text-xs text-destructive" role="alert">
            {pathError}
          </p>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1">
        <PageNavigation
          activeHref={activePageHref}
          dict={dict}
          pages={pageLinks}
          onSelect={(page) => loadTarget(page.href, page.label)}
        />

        <main
          className={cn(
            "grid min-h-0 min-w-0 flex-1 gap-3 bg-muted/20 p-3",
            compare ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
          )}
        >
          {visibleViewports.map((viewport) => (
            <ViewportFrame
              key={`${viewport}:${frameUrl}:${revision}`}
              ref={(handle) => {
                if (handle) {
                  viewportFrameRefs.current[viewport] = handle
                } else {
                  delete viewportFrameRefs.current[viewport]
                }
              }}
              viewport={viewport}
              applyColorScheme={applyPreviewTheme}
              colorScheme={previewColorScheme}
              compare={compare}
              desktopOs={settings.desktopOs}
              errorLabel={dict.errorLabel}
              inspectionError={dict.inspectionError}
              registry={registry}
              label={dict[viewport]}
              layersVisible={layersVisible}
              loadingLabel={dict.loadingLabel}
              src={frameUrl}
              selectedId={
                selected?.viewport === viewport ? selected.id : undefined
              }
              onInventory={handleInventory}
              onError={handleError}
              onPages={handlePages}
              onSelectInstance={handleFrameSelection}
              onShortcutKeyDown={handleShortcutKeyDown}
              sameOriginError={dict.sameOriginError}
            />
          ))}
        </main>

        <aside className="flex w-80 shrink-0 flex-col border-l bg-background xl:w-88">
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-5 p-4">
              {errors[activeViewport] && !compare ? (
                <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {errors[activeViewport]}
                </p>
              ) : null}
              {compare && comparisonErrors.length > 0 ? (
                <div className="space-y-1 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {comparisonErrors.map(({ viewport, message }) => (
                    <p key={viewport}>
                      <span className="font-medium">{dict[viewport]}:</span>{" "}
                      {message}
                    </p>
                  ))}
                </div>
              ) : null}

              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {compare ? dict.compare : dict.components}
                </h2>
                {compare ? (
                  <ComparisonInventory
                    groups={comparisonGroups}
                    dict={dict}
                    onSelect={selectComparisonGroup}
                  />
                ) : (
                  <ViewportInventory
                    groups={activeGroups}
                    viewport={activeViewport}
                    dict={dict}
                    onSelect={selectGroup}
                  />
                )}
              </section>

              {selectedInstance ? (
                <>
                  <Separator />
                  <section className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {dict.selected}
                        </p>
                        <h2 className="font-heading font-semibold">
                          {titleCase(selectedInstance.name)}
                        </h2>
                      </div>
                      <Badge variant="secondary">
                        {selectedInstance.kind === "component"
                          ? dict.component
                          : dict.composition}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/60 p-1.5 text-xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={dict.previous}
                        onClick={() => moveSelection(-1)}
                        disabled={selectedSiblings.length < 2}
                      >
                        <IconChevronLeft />
                      </Button>
                      <span>
                        {dict.instance} {selectedIndex + 1} /{" "}
                        {selectedSiblings.length}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={dict.next}
                        onClick={() => moveSelection(1)}
                        disabled={selectedSiblings.length < 2}
                      >
                        <IconChevronRight />
                      </Button>
                    </div>

                    {selectedProps.length > 0 ? (
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
                        {selectedProps.map(([name, value]) => (
                          <React.Fragment key={name}>
                            <dt className="text-muted-foreground">{name}</dt>
                            <dd className="truncate font-mono" title={value}>
                              {value || "true"}
                            </dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {dict.defaultProps}
                      </p>
                    )}

                    <a
                      href={getInspectorDocsHref(
                        activeLocale,
                        selectedInstance.kind,
                        selectedInstance.name,
                        registry
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {titleCase(selectedInstance.name)} {dict.docs}
                      <IconExternalLink className="size-3" />
                    </a>
                  </section>
                </>
              ) : null}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  )
}

function InspectorScreenshotMenu({
  altKeyLabel,
  dict,
  message,
  onCapture,
  onOpenChange,
  open,
  status,
  viewports,
}: {
  altKeyLabel: "⌥" | "Alt"
  dict: (typeof COPY)[DesignInspectorLocale]
  message: string
  onCapture: (
    viewport: ViewportId,
    scope: InspectorScreenshotScope
  ) => Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  status: InspectorScreenshotStatus
  viewports: readonly ViewportId[]
}) {
  const isCapturing = status === "capturing"
  const StatusIcon =
    status === "capturing"
      ? IconLoader2
      : status === "saved"
        ? IconCameraCheck
        : status === "error"
          ? IconCameraX
          : IconCamera

  return (
    <>
      <InspectorControlTooltip
        label={message || dict.screenshot}
        keys={[altKeyLabel, "S"]}
      >
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger
            disabled={isCapturing}
            render={
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={dict.screenshot}
                aria-busy={isCapturing || undefined}
                aria-keyshortcuts="Alt+S"
                className={cn(
                  status === "saved" &&
                    "text-emerald-600 dark:text-emerald-400",
                  status === "error" && "text-destructive"
                )}
              />
            }
          >
            <StatusIcon className={cn(isCapturing && "animate-spin")} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            data-inspector-ui=""
            className="w-72"
          >
            {viewports.map((viewport, index) => {
              const ViewportIcon = VIEWPORT_ICONS[viewport]
              const preset = VIEWPORT_PRESETS[viewport]

              return (
                <React.Fragment key={viewport}>
                  {index > 0 ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <ViewportIcon className="size-4" />
                      <span>{dict[viewport]}</span>
                      <span className="ml-auto font-mono font-normal tabular-nums">
                        {preset.width} × {preset.height}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      disabled={isCapturing}
                      onClick={() => void onCapture(viewport, "iframe")}
                    >
                      <IconFrame />
                      {dict.screenshotIframe}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isCapturing}
                      onClick={() => void onCapture(viewport, "desktop-window")}
                    >
                      <IconWindow />
                      {dict.screenshotWindow}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </React.Fragment>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </InspectorControlTooltip>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </>
  )
}

function InspectorShortcutMenu({
  altKeyLabel,
  dict,
  onClose,
  onCycleDesktopOs,
  onCycleLocale,
  onCycleTheme,
  onMoveViewport,
  onOpenScreenshot,
  onToggleLayers,
  settings,
  shiftKeyLabel,
}: {
  altKeyLabel: "⌥" | "Alt"
  dict: (typeof COPY)[DesignInspectorLocale]
  onClose: () => void
  onCycleDesktopOs: () => void
  onCycleLocale: () => void
  onCycleTheme: () => void
  onMoveViewport: (direction: InspectorViewportShortcut) => void
  onOpenScreenshot: () => void
  onToggleLayers: () => void
  settings: InspectorSettings
  shiftKeyLabel: "⇧" | "Shift"
}) {
  const activeLanguage = settings.locale === "ko" ? dict.korean : dict.english
  const ThemeIcon = THEME_ICONS[settings.theme]

  return (
    <InspectorControlTooltip label={dict.keyboardShortcuts}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={dict.keyboardShortcuts}
            />
          }
        >
          <IconKeyboard />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          data-inspector-ui=""
          className="w-72"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="space-y-0.5">
              <span className="block text-sm text-foreground">
                {dict.keyboardShortcuts}
              </span>
              <span className="block font-normal">
                {dict.useShortcutOrSelect}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={onClose}>
              <IconX />
              {dict.close}
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[shiftKeyLabel, shiftKeyLabel]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleLayers}>
              <IconLayersIntersect />
              {dict.componentLayers}
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, altKeyLabel]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              aria-keyshortcuts="Alt+S"
              onClick={onOpenScreenshot}
            >
              <IconCamera />
              {dict.screenshot}
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, "S"]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>{dict.viewport}</DropdownMenuLabel>
            <DropdownMenuItem
              aria-keyshortcuts="Alt+ArrowLeft"
              onClick={() => onMoveViewport("previous")}
            >
              <IconChevronLeft />
              {dict.previousViewport}
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, "←"]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              aria-keyshortcuts="Alt+ArrowRight"
              onClick={() => onMoveViewport("next")}
            >
              <IconChevronRight />
              {dict.nextViewport}
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, "→"]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>{dict.preferences}</DropdownMenuLabel>
            <DropdownMenuItem aria-keyshortcuts="Alt+T" onClick={onCycleTheme}>
              <ThemeIcon />
              <span>
                {dict.theme}
                <span className="ml-1 text-muted-foreground">
                  · {dict[settings.theme]}
                </span>
              </span>
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, "T"]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              aria-keyshortcuts="Alt+O"
              onClick={onCycleDesktopOs}
            >
              <IconDeviceDesktop />
              <span>
                {dict.desktopOs}
                <span className="ml-1 text-muted-foreground">
                  · {dict[settings.desktopOs]}
                </span>
              </span>
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, "O"]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem aria-keyshortcuts="Alt+L" onClick={onCycleLocale}>
              <IconLanguage />
              <span>
                {dict.language}
                <span className="ml-1 text-muted-foreground">
                  · {activeLanguage}
                </span>
              </span>
              <DropdownMenuShortcut className="tracking-normal">
                <ShortcutKeys keys={[altKeyLabel, "L"]} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </InspectorControlTooltip>
  )
}

function InspectorPreferences({
  altKeyLabel,
  dict,
  onDesktopOsChange,
  onLocaleChange,
  onThemeChange,
  settings,
  shortcutModifier,
}: {
  altKeyLabel: "⌥" | "Alt"
  dict: (typeof COPY)[DesignInspectorLocale]
  onDesktopOsChange: (desktopOs: InspectorDesktopOs) => void
  onLocaleChange: (locale: DesignInspectorLocale) => void
  onThemeChange: (theme: InspectorTheme) => void
  settings: InspectorSettings
  shortcutModifier: "⌥" | "Alt+"
}) {
  const ThemeIcon = THEME_ICONS[settings.theme]

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={dict.preferences}
    >
      <InspectorControlTooltip label={dict.theme} keys={[altKeyLabel, "T"]}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label={dict.theme}
                aria-keyshortcuts="Alt+T"
                className="gap-1 px-2"
              />
            }
          >
            <ThemeIcon />
            <span className="hidden 2xl:inline">{dict[settings.theme]}</span>
            <IconChevronDown className="hidden size-3 text-muted-foreground 2xl:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            data-inspector-ui=""
            className="w-40"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2">
                {dict.theme}
                <DropdownMenuShortcut>{shortcutModifier}T</DropdownMenuShortcut>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={settings.theme}
                onValueChange={(value) =>
                  onThemeChange(value as InspectorTheme)
                }
              >
                <DropdownMenuRadioItem value="system">
                  <IconDeviceDesktop />
                  {dict.system}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <IconSun />
                  {dict.light}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <IconMoon />
                  {dict.dark}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InspectorControlTooltip>

      <InspectorControlTooltip label={dict.desktopOs} keys={[altKeyLabel, "O"]}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label={dict.desktopOs}
                aria-keyshortcuts="Alt+O"
                className="gap-1 px-2"
              />
            }
          >
            <IconDeviceDesktop />
            <span className="hidden 2xl:inline">
              {dict[settings.desktopOs]}
            </span>
            <IconChevronDown className="hidden size-3 text-muted-foreground 2xl:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            data-inspector-ui=""
            className="w-40"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2">
                {dict.desktopOs}
                <DropdownMenuShortcut>{shortcutModifier}O</DropdownMenuShortcut>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={settings.desktopOs}
                onValueChange={(value) =>
                  onDesktopOsChange(value as InspectorDesktopOs)
                }
              >
                <DropdownMenuRadioItem value="macos">
                  {dict.macos}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="windows">
                  {dict.windows}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ubuntu">
                  {dict.ubuntu}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InspectorControlTooltip>

      <InspectorControlTooltip label={dict.language} keys={[altKeyLabel, "L"]}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label={dict.language}
                aria-keyshortcuts="Alt+L"
                className="gap-1 px-2"
              />
            }
          >
            <IconLanguage />
            <span className="hidden 2xl:inline">
              {settings.locale === "ko" ? dict.korean : dict.english}
            </span>
            <IconChevronDown className="hidden size-3 text-muted-foreground 2xl:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            data-inspector-ui=""
            className="w-40"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2">
                {dict.language}
                <DropdownMenuShortcut>{shortcutModifier}L</DropdownMenuShortcut>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={settings.locale}
                onValueChange={(value) =>
                  onLocaleChange(value as DesignInspectorLocale)
                }
              >
                <DropdownMenuRadioItem value="en">
                  {dict.english}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ko">
                  {dict.korean}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InspectorControlTooltip>
    </div>
  )
}

function PageNavigation({
  activeHref,
  dict,
  onSelect,
  pages,
}: {
  activeHref: string
  dict: (typeof COPY)[DesignInspectorLocale]
  onSelect: (page: InspectorPageLink) => void
  pages: InspectorPageLink[]
}) {
  const [query, setQuery] = React.useState("")
  const visiblePages = React.useMemo(() => {
    const value = query.trim().toLocaleLowerCase()
    if (!value) return pages

    return pages.filter(
      (page) =>
        page.label.toLocaleLowerCase().includes(value) ||
        page.href.toLocaleLowerCase().includes(value)
    )
  }, [pages, query])

  return (
    <aside
      aria-label={dict.pages}
      className="flex w-60 shrink-0 flex-col border-r bg-background xl:w-64"
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-3">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {dict.pages}
        </h2>
        <Badge variant="secondary" className="tabular-nums">
          {pages.length}
        </Badge>
      </div>
      <div className="border-b p-3">
        <label htmlFor="ondo-inspector-page-search" className="sr-only">
          {dict.pageSearch}
        </label>
        <div className="relative">
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="ondo-inspector-page-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.pageSearch}
            size="sm"
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-1 p-2">
          {visiblePages.length > 0 ? (
            visiblePages.map((page) => {
              const active = page.href === activeHref
              return (
                <button
                  key={page.href}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  title={`${page.label} — ${page.href}`}
                  onClick={() => onSelect(page)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    active && "bg-muted text-foreground"
                  )}
                >
                  <IconFile className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">
                      {page.label}
                    </span>
                    {page.label !== page.href ? (
                      <span className="block truncate font-mono text-[10px] text-muted-foreground">
                        {page.href}
                      </span>
                    ) : null}
                  </span>
                </button>
              )
            })
          ) : (
            <p className="px-2.5 py-3 text-xs text-muted-foreground">
              {dict.pagesEmpty}
            </p>
          )}
        </nav>
      </ScrollArea>
    </aside>
  )
}

function ViewportInventory({
  dict,
  groups,
  onSelect,
  viewport,
}: {
  dict: (typeof COPY)[DesignInspectorLocale]
  groups: InspectorGroup[]
  onSelect: (group: InspectorGroup, viewport: ViewportId) => void
  viewport: ViewportId
}) {
  if (groups.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{dict.inventoryEmpty}</p>
    )
  }

  return (
    <div className="space-y-1">
      {groups.map((group) => {
        const summary = summarizeGroupProps(group.instances)

        return (
          <button
            key={group.key}
            type="button"
            onClick={() => onSelect(group, viewport)}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                group.instances.some((instance) => instance.visible)
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              )}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {titleCase(group.name)}
              </span>
              {summary ? (
                <span className="block truncate font-mono text-[10px] text-muted-foreground">
                  {summary}
                </span>
              ) : null}
            </span>
            <Badge variant="secondary" className="tabular-nums">
              {group.instances.length}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

function ComparisonInventory({
  dict,
  groups,
  onSelect,
}: {
  dict: (typeof COPY)[DesignInspectorLocale]
  groups: ComparisonGroup[]
  onSelect: (group: ComparisonGroup) => void
}) {
  if (groups.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{dict.inventoryEmpty}</p>
    )
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_repeat(4,2rem)] gap-1 px-2.5 pb-1 text-center text-[9px] text-muted-foreground uppercase">
        <span />
        <span className="col-span-4 tracking-wide">{dict.viewport}</span>
        <span />
        {(Object.keys(VIEWPORT_PRESETS) as ViewportId[]).map((viewport) => (
          <span key={viewport} title={dict[viewport]}>
            {VIEWPORT_SHORT_LABELS[viewport]}
          </span>
        ))}
      </div>
      {groups.map((group) => (
        <button
          key={group.key}
          type="button"
          onClick={() => onSelect(group)}
          className="grid w-full grid-cols-[1fr_repeat(4,2rem)] items-center gap-1 rounded-lg px-2.5 py-2 text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="truncate text-sm font-medium">
            {titleCase(group.name)}
          </span>
          {(Object.keys(VIEWPORT_PRESETS) as ViewportId[]).map((viewport) => (
            <span key={viewport} className="text-center">
              <StatusDot
                status={group.status[viewport]}
                label={dict[group.status[viewport]]}
              />
            </span>
          ))}
        </button>
      ))}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-2.5 pt-2 text-[10px] text-muted-foreground">
        {(["visible", "hidden", "absent"] as InspectorStatus[]).map(
          (status) => (
            <span key={status} className="inline-flex items-center gap-1">
              <StatusDot status={status} label={dict[status]} />
              {dict[status]}
            </span>
          )
        )}
      </div>
    </div>
  )
}

export {
  type DesignInspectorLocale,
  type DesignInspectorPage,
  type DesignInspectorPosition,
  type DesignInspectorProps,
}
