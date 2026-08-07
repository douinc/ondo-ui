import {
  VIEWPORT_PRESETS,
  type ViewportId,
} from "./model"

export type InspectorScreenshotScope = "iframe" | "desktop-window"

type CaptureInspectorScreenshotOptions = {
  desktopWindow: HTMLElement
  iframe: HTMLIFrameElement
  scope: InspectorScreenshotScope
  viewport: ViewportId
  viewportBlob?: Blob
}

type ModernScreenshotModule = typeof import("modern-screenshot")
type DomToBlob = ModernScreenshotModule["domToBlob"]

const DESKTOP_WINDOW_CAPTURE_PADDING = 32

function getDocumentBackground(document: Document): string | null {
  const view = document.defaultView
  if (!view) return null

  for (const element of [document.documentElement, document.body]) {
    if (!element) continue
    const color = view.getComputedStyle(element).backgroundColor
    if (color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)") {
      return color
    }
  }

  return null
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("The viewport screenshot could not be embedded."))
      }
    }
    reader.onerror = () => {
      reject(
        reader.error ?? new Error("The viewport screenshot could not be read.")
      )
    }
    reader.readAsDataURL(blob)
  })
}

async function captureIframeViewport(
  iframe: HTMLIFrameElement,
  viewport: ViewportId,
  domToBlob: DomToBlob
): Promise<Blob> {
  const document = iframe.contentDocument
  const view = iframe.contentWindow
  const preset = VIEWPORT_PRESETS[viewport]

  if (!document || !view || view.location.origin !== window.location.origin) {
    throw new Error("The iframe is not available to the same-origin inspector.")
  }

  await document.fonts?.ready

  return domToBlob(document.documentElement, {
    width: preset.width,
    height: preset.height,
    scale: 1,
    backgroundColor: getDocumentBackground(document),
    features: {
      restoreScrollPosition: true,
    },
    font: {
      preferredFormat: "woff2",
    },
    style: {
      height: `${preset.height}px`,
      maxHeight: "none",
      maxWidth: "none",
      minHeight: `${preset.height}px`,
      minWidth: `${preset.width}px`,
      overflow: "hidden",
      width: `${preset.width}px`,
    },
  })
}

async function captureDesktopWindow(
  desktopWindow: HTMLElement,
  viewportBlob: Blob,
  domToBlob: DomToBlob
): Promise<Blob> {
  const document = desktopWindow.ownerDocument
  const content = desktopWindow.querySelector<HTMLElement>(
    '[data-slot="desktop-window-content"]'
  )
  const titlebar = desktopWindow.querySelector<HTMLElement>(
    '[data-slot="desktop-window-titlebar"]'
  )
  const viewportSurface = content?.firstElementChild as HTMLElement | null

  if (!content || !titlebar || !viewportSurface) {
    throw new Error("The DesktopWindow frame could not be captured.")
  }

  const titlebarRect = titlebar.getBoundingClientRect()
  const surfaceRect = viewportSurface.getBoundingClientRect()
  const padding = DESKTOP_WINDOW_CAPTURE_PADDING

  const titlebarBlob = await domToBlob(titlebar, {
    width: Math.max(1, Math.ceil(surfaceRect.width)),
    height: Math.max(1, Math.ceil(titlebarRect.height)),
    scale: 1,
    backgroundColor: null,
    font: false,
    style: {
      width: `${Math.max(1, Math.ceil(surfaceRect.width))}px`,
      minWidth: `${Math.max(1, Math.ceil(surfaceRect.width))}px`,
      maxWidth: `${Math.max(1, Math.ceil(surfaceRect.width))}px`,
    },
  })
  const titlebarImage = document.createElement("img")
  titlebarImage.alt = ""
  titlebarImage.decoding = "sync"
  titlebarImage.src = await blobToDataUrl(titlebarBlob)
  await titlebarImage.decode()

  const viewportImage = document.createElement("img")
  viewportImage.alt = ""
  viewportImage.decoding = "sync"
  viewportImage.src = await blobToDataUrl(viewportBlob)
  await viewportImage.decode()

  // The iframe is rendered with a CSS scale inside the inspector. Build the
  // exported frame at the iframe's native pixel size instead of using the
  // scaled on-screen DesktopWindow dimensions.
  const viewportWidth =
    viewportImage.naturalWidth || Math.ceil(surfaceRect.width)
  const viewportHeight =
    viewportImage.naturalHeight || Math.ceil(surfaceRect.height)
  const renderScale =
    surfaceRect.width > 0 ? viewportWidth / surfaceRect.width : 1
  const computedWindowStyle =
    document.defaultView?.getComputedStyle(desktopWindow)
  const borderX = Number.parseFloat(computedWindowStyle?.borderLeftWidth ?? "0")
  const borderY = Number.parseFloat(computedWindowStyle?.borderTopWidth ?? "0")
  const titlebarWidth = titlebarImage.naturalWidth || viewportWidth
  const titlebarHeight =
    titlebarImage.naturalHeight || Math.ceil(titlebarRect.height)
  const frameWidth = Math.max(1, Math.ceil(viewportWidth + borderX * 2))
  const frameHeight = Math.max(
    1,
    Math.ceil(viewportHeight + titlebarHeight * renderScale + borderY * 2)
  )
  const captureWidth = frameWidth + padding * 2
  const captureHeight = frameHeight + padding * 2

  const canvas = document.createElement("canvas")
  canvas.width = captureWidth
  canvas.height = captureHeight
  const context = canvas.getContext("2d")
  if (!context) throw new Error("The DesktopWindow canvas is unavailable.")

  const frameX = padding
  const frameY = padding
  const computedContentStyle = document.defaultView?.getComputedStyle(content)
  const backgroundColor =
    computedContentStyle?.backgroundColor ??
    computedWindowStyle?.backgroundColor ??
    "transparent"
  const radius = Number.parseFloat(
    computedWindowStyle?.borderTopLeftRadius ?? "0"
  )

  context.save()
  context.shadowColor = "rgba(0, 0, 0, 0.2)"
  context.shadowBlur = 20
  context.shadowOffsetY = 6
  context.fillStyle = backgroundColor
  context.beginPath()
  context.roundRect(
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    radius * renderScale
  )
  context.fill()
  context.restore()

  context.save()
  context.beginPath()
  context.roundRect(
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    radius * renderScale
  )
  context.clip()
  context.fillStyle = backgroundColor
  context.fillRect(frameX, frameY, frameWidth, frameHeight)
  context.drawImage(
    titlebarImage,
    frameX + borderX,
    frameY + borderY,
    titlebarWidth,
    titlebarHeight * renderScale
  )
  context.drawImage(
    viewportImage,
    frameX + borderX,
    frameY + borderY + titlebarHeight * renderScale,
    viewportWidth,
    viewportHeight
  )
  context.restore()

  context.strokeStyle = computedWindowStyle?.borderTopColor ?? "rgba(0,0,0,.1)"
  context.lineWidth = 1
  context.beginPath()
  context.roundRect(
    frameX + 0.5,
    frameY + 0.5,
    frameWidth - 1,
    frameHeight - 1,
    radius * renderScale
  )
  context.stroke()

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else
        reject(new Error("The DesktopWindow screenshot could not be encoded."))
    }, "image/png")
  })
}

export async function captureInspectorViewportScreenshot(
  iframe: HTMLIFrameElement,
  viewport: ViewportId
): Promise<Blob> {
  const { domToBlob } = await import("modern-screenshot")
  return captureIframeViewport(iframe, viewport, domToBlob)
}

export async function captureInspectorScreenshot({
  desktopWindow,
  iframe,
  scope,
  viewport,
  viewportBlob,
}: CaptureInspectorScreenshotOptions): Promise<Blob> {
  const { domToBlob } = await import("modern-screenshot")
  const capturedViewportBlob =
    viewportBlob ?? (await captureIframeViewport(iframe, viewport, domToBlob))

  if (scope === "iframe") return capturedViewportBlob
  return captureDesktopWindow(desktopWindow, capturedViewportBlob, domToBlob)
}

function normalizeScreenshotPath(pageHref: string): string {
  try {
    const pathname = decodeURIComponent(
      new URL(pageHref, "https://ondo.local").pathname
    )
    return (
      pathname
        .replace(/^\/+|\/+$/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "home"
    )
  } catch {
    return "page"
  }
}

export function buildInspectorScreenshotFilename(
  pageHref: string,
  viewport: ViewportId,
  scope: InspectorScreenshotScope,
  capturedAt = new Date()
): string {
  const page = normalizeScreenshotPath(pageHref)
  const target = scope === "iframe" ? "iframe" : "desktop-window"
  const timestamp = capturedAt
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replaceAll(":", "-")

  return `ondo-inspector-${page}-${viewport}-${target}-${timestamp}.png`
}

export function downloadInspectorScreenshot(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.download = filename
  anchor.href = url
  anchor.style.display = "none"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
