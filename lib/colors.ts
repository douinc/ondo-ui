import { TAILWIND_COLORS } from "@/lib/tailwind-colors"

interface Oklch {
  l: number
  c: number
  h: number
}

export interface ColorFormats {
  oklch: string
  hex: string
  rgb: string
  hsl: string
  /** Matching Tailwind CSS default palette class (e.g. "red-600", "white/10"), or null when custom. */
  tailwindClassName: string | null
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

// Tailwind's build step (Lightning CSS) rewrites authored oklch() into a hex
// fallback plus a lab() override for browser support, so the literal oklch()
// text never reaches getComputedStyle. Canvas resolves whatever format the
// browser actually serves (hex/lab/oklch/...) down to concrete sRGB bytes.
let canvasContext: CanvasRenderingContext2D | null | undefined

function getCanvasContext(): CanvasRenderingContext2D | null {
  if (canvasContext !== undefined) return canvasContext
  if (typeof document === "undefined") {
    canvasContext = null
    return canvasContext
  }
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  canvasContext = canvas.getContext("2d", { willReadFrequently: true })
  return canvasContext
}

const INVALID_SENTINEL = "rgba(1, 2, 3, 0.5)"

function resolveToRgba(raw: string): { rgb: [number, number, number]; alpha: number } | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const ctx = getCanvasContext()
  if (!ctx) return null

  ctx.fillStyle = INVALID_SENTINEL
  const sentinelNormalized = ctx.fillStyle
  ctx.fillStyle = trimmed
  if (ctx.fillStyle === sentinelNormalized && trimmed !== INVALID_SENTINEL) return null
  const resolvedStyle = ctx.fillStyle

  // Composite over black and white and solve algebraically for the true alpha
  // and unpremultiplied color. Reading a single transparent-backdrop pixel and
  // dividing by alpha amplifies 8-bit quantization noise for low-alpha colors
  // (e.g. white at 10% alpha can read back visibly tinted); this cancels that.
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = resolvedStyle
  ctx.fillRect(0, 0, 1, 1)
  const onBlack = ctx.getImageData(0, 0, 1, 1).data

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = resolvedStyle
  ctx.fillRect(0, 0, 1, 1)
  const onWhite = ctx.getImageData(0, 0, 1, 1).data

  const alpha = Math.min(
    1,
    Math.max(0, (3 - (onWhite[0] - onBlack[0] + (onWhite[1] - onBlack[1]) + (onWhite[2] - onBlack[2])) / 255) / 3)
  )

  if (alpha === 0) return { rgb: [0, 0, 0], alpha: 0 }

  const rgb = [onBlack[0], onBlack[1], onBlack[2]].map((channel) =>
    Math.min(255, Math.max(0, Math.round(channel / alpha)))
  ) as [number, number, number]

  return { rgb, alpha }
}

// Oklab <-> linear sRGB matrices from https://bottosson.github.io/posts/oklab/
function srgbToOklch([r, g, b]: [number, number, number]): Oklch {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const c = Math.sqrt(a * a + b2 * b2)
  let h = (Math.atan2(b2, a) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: L, c, h }
}

function rgbToHsl([r, g, b]: [number, number, number]) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function formatAlphaSuffix(alpha: number, unit: "" | "%") {
  if (alpha >= 1) return ""
  const value = unit === "%" ? round(alpha * 100, 0) : round(alpha, 2)
  return ` / ${value}${unit}`
}

function formatOklch({ l, c, h }: Oklch, alpha: number) {
  const roundedC = round(c, 3)
  // Hue is meaningless at zero chroma; avoid printing atan2 noise like oklch(1 0 89.876).
  const roundedH = roundedC === 0 ? 0 : round(h, 3)
  return `oklch(${round(l, 3)} ${roundedC} ${roundedH}${formatAlphaSuffix(alpha, "%")})`
}

function formatHex(rgb: [number, number, number], alpha: number) {
  const hex = rgb.map((v) => v.toString(16).padStart(2, "0")).join("")
  if (alpha >= 1) return `#${hex}`
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
  return `#${hex}${a}`
}

function formatRgb(rgb: [number, number, number], alpha: number) {
  return `rgb(${rgb.join(" ")}${formatAlphaSuffix(alpha, "%")})`
}

function formatHsl(rgb: [number, number, number], alpha: number) {
  const { h, s, l } = rgbToHsl(rgb)
  return `hsl(${h} ${s}% ${l}%${formatAlphaSuffix(alpha, "%")})`
}

interface Lab {
  L: number
  a: number
  b: number
}

function oklchToLab({ l, c, h }: Oklch): Lab {
  const rad = (h * Math.PI) / 180
  return { L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) }
}

// Cartesian (a, b) naturally collapses hue to ~0 when chroma is ~0, so
// achromatic colors compare correctly without a separate special case.
const TAILWIND_LAB = TAILWIND_COLORS.map((entry) => ({
  entry,
  lab: oklchToLab(entry),
}))

// Round-trip noise (Tailwind's oklch->lab build-time rewrite, then the browser's
// lab->8bit-sRGB canvas readback) can shift a color by up to ~0.013 in Lab space,
// worst for saturated colors and low-alpha translucency. Adjacent Tailwind shades
// are ~0.04+ apart, so this threshold matches real tokens without crossing shades.
const MATCH_THRESHOLD = 0.02

function matchTailwindClassName(oklch: Oklch, alpha: number): string | null {
  const target = oklchToLab(oklch)

  let best: (typeof TAILWIND_LAB)[number] | null = null
  let bestDistance = Infinity

  for (const candidate of TAILWIND_LAB) {
    const dL = candidate.lab.L - target.L
    const da = candidate.lab.a - target.a
    const db = candidate.lab.b - target.b
    const distance = Math.sqrt(dL * dL + da * da + db * db)
    if (distance < bestDistance) {
      bestDistance = distance
      best = candidate
    }
  }

  if (!best || bestDistance > MATCH_THRESHOLD) return null
  if (alpha >= 1) return best.entry.name
  return `${best.entry.name}/${round(alpha * 100, 0)}`
}

export function describeColor(raw: string): ColorFormats | null {
  const resolved = resolveToRgba(raw)
  if (!resolved) return null

  const { rgb } = resolved
  // Canvas alpha readback has ~1/255 (~0.4%) quantization noise (e.g. a true
  // 10% reads back as 10.1%). Authored alpha is always a clean percentage, so
  // snap to the nearest 1% once here and use that everywhere downstream.
  const alpha = resolved.alpha >= 1 ? 1 : round(resolved.alpha, 2)
  const oklch = srgbToOklch(rgb)

  return {
    oklch: formatOklch(oklch, alpha),
    hex: formatHex(rgb, alpha),
    rgb: formatRgb(rgb, alpha),
    hsl: formatHsl(rgb, alpha),
    tailwindClassName: matchTailwindClassName(oklch, alpha),
  }
}
