"use client"

import * as React from "react"

import {
  areComponentLayersEqual,
  collectComponentLayers,
  resolveComponentLayerHit,
  type ComponentLayer,
  type ComponentLayerHit,
} from "./component-layer-overlay"
import {
  INSPECTOR_FRAME_PARAM,
  preserveInspectorFrameMarker,
  VIEWPORT_PRESETS,
  type InspectorColorScheme,
  type InspectorDesktopOs,
  type InspectorPageLink,
  type ViewportId,
} from "./model"
import type { InspectorRegistry } from "./catalog"
import {
  captureInspectorScreenshot,
  captureInspectorViewportScreenshot,
  type InspectorScreenshotScope,
} from "./screenshot"
import {
  createInspectorScanner,
  type InspectorScanner,
  type ScannedInspectorInstance,
} from "./scanner"
import {
  DesktopWindow,
  DesktopWindowContent,
  DesktopWindowControls,
  DesktopWindowTitle,
  DesktopWindowTitlebar,
} from "./ui/desktop-window"
import { cn } from "./lib/utils"

type OverlayRect = {
  height: number
  left: number
  top: number
  width: number
}

type ViewportScreenshotCache = {
  blob: Blob
  key: string
}

type ViewportFrameProps = {
  applyColorScheme?: (
    document: Document,
    colorScheme: InspectorColorScheme
  ) => void
  className?: string
  colorScheme: InspectorColorScheme
  compare: boolean
  desktopOs: InspectorDesktopOs
  errorLabel: string
  inspectionError: string
  registry: InspectorRegistry
  label: string
  layersVisible: boolean
  loadingLabel: string
  onError: (viewport: ViewportId, message?: string) => void
  onInventory: (
    viewport: ViewportId,
    instances: ScannedInspectorInstance[]
  ) => void
  onPages: (pages: InspectorPageLink[]) => void
  onSelectInstance: (viewport: ViewportId, id: string) => void
  onShortcutKeyDown: (event: KeyboardEvent) => void
  ref?: React.Ref<ViewportFrameHandle>
  sameOriginError: string
  selectedId?: string
  src: string
  viewport: ViewportId
}

export type ViewportFrameHandle = {
  captureScreenshot: (scope: InspectorScreenshotScope) => Promise<Blob>
}

function applyDocumentColorScheme(
  document: Document,
  colorScheme: InspectorColorScheme
) {
  document.documentElement.classList.remove("light", "dark")
  document.documentElement.classList.add(colorScheme)
  document.documentElement.style.colorScheme = colorScheme
}

function ensureFrameMarker(view: Window) {
  const current = new URL(view.location.href)
  if (current.searchParams.get(INSPECTOR_FRAME_PARAM) === "1") return

  current.searchParams.set(INSPECTOR_FRAME_PARAM, "1")
  view.history.replaceState(view.history.state, "", current)
}

// A non-client navigation inside the frame drops the marker on load, and the
// framed app's own router can re-assert its URL after hydration and drop it
// again shortly after. Wrapping pushState/replaceState keeps the marker on
// every URL this document sets for itself, however it sets it, for as long
// as the document lives inside the inspector.
function guardFrameHistory(view: Window) {
  const history = view.history as History & { __ondoFrameGuarded?: boolean }
  if (history.__ondoFrameGuarded) return
  history.__ondoFrameGuarded = true

  const nativePushState = history.pushState.bind(history)
  const nativeReplaceState = history.replaceState.bind(history)

  history.pushState = (data, unused, url) =>
    nativePushState(data, unused, preserveInspectorFrameMarker(url, view.location.href))
  history.replaceState = (data, unused, url) =>
    nativeReplaceState(data, unused, preserveInspectorFrameMarker(url, view.location.href))
}

const RESCAN_ATTRIBUTES = [
  "class",
  "style",
  "hidden",
  "href",
  "aria-label",
  "title",
  "data-slot",
  "data-variant",
  "data-size",
  "data-orientation",
]

// Animated pages mutate style attributes every frame; rescanning the whole
// document that often is too expensive, so scans are throttled.
const SCAN_MIN_INTERVAL = 150

function areComponentLayerHitsEqual(
  left: ComponentLayerHit | undefined,
  right: ComponentLayerHit | undefined
): boolean {
  if (left === right) return true
  if (!left || !right) return false

  return (
    left.candidateIds.length === right.candidateIds.length &&
    left.candidateIds.every((id, index) => id === right.candidateIds[index]) &&
    areComponentLayersEqual([left.layer], [right.layer])
  )
}

export function ViewportFrame({
  applyColorScheme,
  className,
  colorScheme,
  compare,
  desktopOs,
  errorLabel,
  inspectionError,
  registry,
  label,
  layersVisible,
  loadingLabel,
  onError,
  onInventory,
  onPages,
  onSelectInstance,
  onShortcutKeyDown,
  ref,
  sameOriginError,
  selectedId,
  src,
  viewport,
}: ViewportFrameProps) {
  const preset = VIEWPORT_PRESETS[viewport]
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const desktopWindowRef = React.useRef<HTMLDivElement>(null)
  const frameRef = React.useRef<HTMLIFrameElement>(null)
  const scannerRef = React.useRef<InspectorScanner | null>(null)
  const instancesRef = React.useRef<ScannedInspectorInstance[]>([])
  const cleanupRef = React.useRef<(() => void) | null>(null)
  const screenshotCacheRef = React.useRef<ViewportScreenshotCache | null>(null)
  const pointerRef = React.useRef<{ x: number; y: number } | null>(null)
  const selectedIdRef = React.useRef(selectedId)
  const layersVisibleRef = React.useRef(layersVisible)
  const scaleRef = React.useRef(1)
  const onErrorRef = React.useRef(onError)
  const onInventoryRef = React.useRef(onInventory)
  const onPagesRef = React.useRef(onPages)
  const onSelectInstanceRef = React.useRef(onSelectInstance)
  const onShortcutKeyDownRef = React.useRef(onShortcutKeyDown)
  const [overlay, setOverlay] = React.useState<OverlayRect | null>(null)
  const [componentLayers, setComponentLayers] = React.useState<
    ComponentLayer[]
  >([])
  const [hoveredLayer, setHoveredLayer] = React.useState<
    ComponentLayerHit | undefined
  >()
  const [scale, setScale] = React.useState(1)
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading"
  )

  React.useEffect(() => {
    selectedIdRef.current = selectedId
    scaleRef.current = scale
    onErrorRef.current = onError
    onInventoryRef.current = onInventory
    onPagesRef.current = onPages
    onSelectInstanceRef.current = onSelectInstance
    onShortcutKeyDownRef.current = onShortcutKeyDown
  }, [
    onError,
    onInventory,
    onPages,
    onSelectInstance,
    onShortcutKeyDown,
    scale,
    selectedId,
  ])

  const updateOverlay = React.useCallback(() => {
    const id = selectedIdRef.current
    const element = id ? scannerRef.current?.getElement(id) : undefined

    if (!element) {
      setOverlay(null)
      return
    }

    const rect = element.getBoundingClientRect()
    const nextScale = scaleRef.current
    if (rect.width <= 0 || rect.height <= 0) {
      setOverlay(null)
      return
    }

    setOverlay({
      left: rect.left * nextScale,
      top: rect.top * nextScale,
      width: rect.width * nextScale,
      height: rect.height * nextScale,
    })
  }, [])

  const updateHoveredLayer = React.useCallback(
    (instances = instancesRef.current) => {
      const pointer = pointerRef.current
      const document = frameRef.current?.contentDocument

      if (!layersVisibleRef.current || !pointer || !document) {
        setHoveredLayer((current) =>
          current === undefined ? current : undefined
        )
        return
      }

      const next = resolveComponentLayerHit(
        instances,
        document.elementsFromPoint(pointer.x, pointer.y),
        pointer.x,
        pointer.y,
        preset.width,
        preset.height
      )
      setHoveredLayer((current) =>
        areComponentLayerHitsEqual(current, next) ? current : next
      )
    },
    [preset.height, preset.width]
  )

  const scanDocument = React.useCallback(() => {
    const scanner = scannerRef.current
    const instances = scanner?.scan() ?? []
    instancesRef.current = instances
    onInventoryRef.current(viewport, instances)
    onPagesRef.current(scanner?.scanPages() ?? [])
    if (layersVisibleRef.current) {
      const nextLayers = collectComponentLayers(
        instances,
        preset.width,
        preset.height
      )
      setComponentLayers((current) =>
        areComponentLayersEqual(current, nextLayers) ? current : nextLayers
      )
      updateHoveredLayer(instances)
    }
    updateOverlay()
  }, [preset.height, preset.width, updateHoveredLayer, updateOverlay, viewport])

  React.useEffect(() => {
    layersVisibleRef.current = layersVisible
    if (layersVisible) {
      scanDocument()
    } else {
      pointerRef.current = null
    }
  }, [layersVisible, scanDocument])

  const handleLoad = React.useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    screenshotCacheRef.current = null
    scannerRef.current = null
    instancesRef.current = []
    pointerRef.current = null
    setOverlay(null)
    setComponentLayers([])
    setHoveredLayer(undefined)

    const frame = frameRef.current
    const document = frame?.contentDocument
    const view = frame?.contentWindow

    try {
      if (
        !document ||
        !view ||
        view.location.origin !== window.location.origin
      ) {
        throw new Error(sameOriginError)
      }

      ensureFrameMarker(view)
      guardFrameHistory(view)

      const scanner = createInspectorScanner(document, registry)
      ;(applyColorScheme ?? applyDocumentColorScheme)(document, colorScheme)
      scannerRef.current = scanner

      let animationFrame = 0
      let hoverAnimationFrame = 0
      let scanTimer = 0
      let lastScanAt = 0
      const runScan = () => {
        lastScanAt = Date.now()
        scanDocument()
      }
      const queueScan = () => {
        if (animationFrame || scanTimer) return

        const waitFor = SCAN_MIN_INTERVAL - (Date.now() - lastScanAt)
        if (waitFor <= 0) {
          animationFrame = view.requestAnimationFrame(() => {
            animationFrame = 0
            runScan()
          })
        } else {
          scanTimer = view.setTimeout(() => {
            scanTimer = 0
            animationFrame = view.requestAnimationFrame(() => {
              animationFrame = 0
              runScan()
            })
          }, waitFor)
        }
      }
      const queueHoverUpdate = () => {
        if (hoverAnimationFrame) return
        hoverAnimationFrame = view.requestAnimationFrame(() => {
          hoverAnimationFrame = 0
          updateHoveredLayer()
        })
      }
      const observer = new MutationObserver(() => {
        screenshotCacheRef.current = null
        queueScan()
      })
      const handleShortcutKeyDown = (event: KeyboardEvent) => {
        onShortcutKeyDownRef.current(event)
      }
      const handleDocumentScroll = () => {
        screenshotCacheRef.current = null
        updateOverlay()
        if (layersVisibleRef.current) queueScan()
      }
      const handlePointerMove = (event: PointerEvent) => {
        if (!layersVisibleRef.current) return
        pointerRef.current = { x: event.clientX, y: event.clientY }
        queueHoverUpdate()
      }
      const handlePointerLeave = () => {
        pointerRef.current = null
        view.cancelAnimationFrame(hoverAnimationFrame)
        hoverAnimationFrame = 0
        setHoveredLayer(undefined)
      }
      const handleLayerClick = (event: MouseEvent) => {
        if (!layersVisibleRef.current || event.button !== 0) return

        const hit = resolveComponentLayerHit(
          instancesRef.current,
          document.elementsFromPoint(event.clientX, event.clientY),
          event.clientX,
          event.clientY,
          preset.width,
          preset.height
        )
        const id = hit?.candidateIds[0]
        if (!hit || !id) return

        event.preventDefault()
        event.stopPropagation()
        pointerRef.current = { x: event.clientX, y: event.clientY }
        setHoveredLayer((current) =>
          areComponentLayerHitsEqual(current, hit) ? current : hit
        )
        onSelectInstanceRef.current(viewport, id)
      }

      observer.observe(document.documentElement, {
        attributeFilter: RESCAN_ATTRIBUTES,
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      })
      document.addEventListener("scroll", handleDocumentScroll, true)
      document.addEventListener("keydown", handleShortcutKeyDown, true)
      document.addEventListener("pointermove", handlePointerMove, true)
      document.documentElement.addEventListener(
        "pointerleave",
        handlePointerLeave
      )
      document.addEventListener("click", handleLayerClick, true)
      view.addEventListener("resize", queueScan)

      cleanupRef.current = () => {
        observer.disconnect()
        document.removeEventListener("scroll", handleDocumentScroll, true)
        document.removeEventListener("keydown", handleShortcutKeyDown, true)
        document.removeEventListener("pointermove", handlePointerMove, true)
        document.documentElement.removeEventListener(
          "pointerleave",
          handlePointerLeave
        )
        document.removeEventListener("click", handleLayerClick, true)
        view.removeEventListener("resize", queueScan)
        view.cancelAnimationFrame(animationFrame)
        view.cancelAnimationFrame(hoverAnimationFrame)
        view.clearTimeout(scanTimer)
      }

      setStatus("ready")
      onErrorRef.current(viewport, undefined)
      runScan()
    } catch (error) {
      const message = error instanceof Error ? error.message : inspectionError
      setStatus("error")
      onErrorRef.current(viewport, message)
      onInventoryRef.current(viewport, [])
    }
  }, [
    applyColorScheme,
    colorScheme,
    inspectionError,
    registry,
    sameOriginError,
    scanDocument,
    preset.height,
    preset.width,
    updateHoveredLayer,
    updateOverlay,
    viewport,
  ])

  React.useEffect(() => {
    const frame = frameRef.current
    const document = frame?.contentDocument
    const view = frame?.contentWindow

    try {
      if (
        !document ||
        !view ||
        view.location.origin !== window.location.origin
      ) {
        return
      }
      ;(applyColorScheme ?? applyDocumentColorScheme)(document, colorScheme)
    } catch {
      // The load handler reports cross-origin access errors to the inspector.
    }
  }, [applyColorScheme, colorScheme])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const availableWidth = Math.max(
        1,
        canvas.clientWidth - (compare ? 32 : 0)
      )
      const nextScale = Math.min(1, availableWidth / preset.width)
      setScale((current) =>
        Math.abs(current - nextScale) < 0.0001 ? current : nextScale
      )
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    return () => observer.disconnect()
  }, [compare, preset.width])

  React.useEffect(() => {
    const element = selectedId
      ? scannerRef.current?.getElement(selectedId)
      : undefined

    if (!element) {
      setOverlay(null)
      return
    }

    const view = element.ownerDocument.defaultView
    const rect = element.getBoundingClientRect()
    const isInViewport = Boolean(
      view &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < view.innerHeight &&
      rect.left < view.innerWidth
    )
    if (!isInViewport) {
      element.scrollIntoView({ block: "center", inline: "center" })
    }
    const animationFrame = view?.requestAnimationFrame(updateOverlay)
    return () => {
      if (animationFrame !== undefined) {
        view?.cancelAnimationFrame(animationFrame)
      }
    }
  }, [selectedId, updateOverlay])

  React.useEffect(() => {
    updateOverlay()
  }, [scale, updateOverlay])

  React.useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  const pinnedLayer = selectedId
    ? componentLayers.find((layer) => layer.ids.includes(selectedId))
    : undefined
  const pinnedLabelIndex =
    selectedId && pinnedLayer ? pinnedLayer.ids.indexOf(selectedId) : -1
  const activeLayer =
    hoveredLayer?.layer ??
    (pinnedLayer
      ? {
          ...pinnedLayer,
          label: pinnedLayer.labels[pinnedLabelIndex] ?? pinnedLayer.label,
        }
      : undefined)
  const activeLayerRight = activeLayer
    ? Math.min(
        preset.width * scale,
        Math.max(0, (activeLayer.left + activeLayer.width) * scale)
      )
    : 0
  const activeLayerTop = activeLayer
    ? Math.min(
        Math.max(0, activeLayer.top * scale),
        Math.max(0, preset.height * scale - 20)
      )
    : 0

  const captureScreenshot = React.useCallback(
    async (scope: InspectorScreenshotScope) => {
      const desktopWindow = desktopWindowRef.current
      const iframe = frameRef.current

      if (status !== "ready" || !desktopWindow || !iframe) {
        throw new Error("The viewport is not ready to capture.")
      }

      const document = iframe.contentDocument
      const view = iframe.contentWindow
      const scrollKey = view
        ? `${view.scrollX}:${view.scrollY}:${document?.documentElement.scrollLeft ?? 0}:${document?.documentElement.scrollTop ?? 0}:${document?.body?.scrollLeft ?? 0}:${document?.body?.scrollTop ?? 0}`
        : "0:0:0:0:0:0"
      const cacheKey = `${src}:${colorScheme}:${scrollKey}`
      const cached = screenshotCacheRef.current
      const viewportBlob =
        cached?.key === cacheKey
          ? cached.blob
          : await captureInspectorViewportScreenshot(iframe, viewport)

      screenshotCacheRef.current = { blob: viewportBlob, key: cacheKey }

      if (scope === "iframe") return viewportBlob

      return captureInspectorScreenshot({
        desktopWindow,
        iframe,
        scope,
        viewport,
        viewportBlob,
      })
    },
    [colorScheme, src, status, viewport]
  )

  React.useImperativeHandle(ref, () => ({ captureScreenshot }), [
    captureScreenshot,
  ])

  return (
    <DesktopWindow
      ref={desktopWindowRef}
      os={desktopOs}
      role="region"
      aria-label={`${label} — ${preset.width} × ${preset.height}`}
      className={cn("min-h-0 min-w-0 flex-1 shadow-lg", className)}
    >
      <DesktopWindowTitlebar>
        <DesktopWindowControls />
        <DesktopWindowTitle>
          {label} [{preset.width} × {preset.height}]
        </DesktopWindowTitle>
      </DesktopWindowTitlebar>
      <DesktopWindowContent
        ref={canvasRef}
        className={cn(
          "relative flex min-h-0 items-start justify-center overflow-x-hidden overflow-y-auto bg-muted/40",
          compare ? "p-4" : "p-0"
        )}
        style={{ scrollbarGutter: compare ? "stable both-edges" : "auto" }}
      >
        <div
          className="relative shrink-0 overflow-hidden bg-background"
          style={{
            width: preset.width * scale,
            height: preset.height * scale,
          }}
        >
          <iframe
            ref={frameRef}
            src={src}
            title={`${label} — ${preset.width} × ${preset.height}`}
            onLoad={handleLoad}
            className="absolute top-0 left-0 border-0 bg-background"
            style={{
              width: preset.width,
              height: preset.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
          {overlay ? (
            <div
              aria-hidden="true"
              data-slot="design-inspector-highlight"
              className="pointer-events-none absolute z-50 rounded-[3px] border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_0_1px_oklch(1_0_0/0.8)]"
              style={overlay}
            />
          ) : null}
          {layersVisible ? (
            <div
              aria-hidden="true"
              data-slot="design-inspector-component-layers"
              className="pointer-events-none absolute inset-0 z-60"
            >
              {componentLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="absolute border border-sky-500/75 shadow-[inset_0_0_0_1px_oklch(1_0_0/0.35)]"
                  style={{
                    height: layer.height * scale,
                    left: layer.left * scale,
                    top: layer.top * scale,
                    width: layer.width * scale,
                  }}
                />
              ))}
              {activeLayer ? (
                <>
                  <div
                    className="absolute border-2 border-sky-500 bg-sky-500/10 shadow-[inset_0_0_0_1px_oklch(1_0_0/0.5)]"
                    style={{
                      height: activeLayer.height * scale,
                      left: activeLayer.left * scale,
                      top: activeLayer.top * scale,
                      width: activeLayer.width * scale,
                    }}
                  />
                  <span
                    className="absolute z-10 -translate-x-full truncate bg-sky-600 px-1.5 py-0.5 font-mono text-[10px]/4 font-semibold whitespace-nowrap text-white shadow-sm"
                    style={{
                      left: activeLayerRight,
                      maxWidth: Math.min(256, activeLayerRight),
                      top: activeLayerTop,
                    }}
                  >
                    {activeLayer.label}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        {status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60 text-sm text-muted-foreground">
            {loadingLabel}
          </div>
        ) : null}
        {status === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6 text-center text-sm text-destructive">
            {errorLabel}
          </div>
        ) : null}
      </DesktopWindowContent>
    </DesktopWindow>
  )
}
