import {
  ONDO_INSPECTOR_REGISTRY,
  resolveComponentName,
  resolveCompositionName,
  type InspectorRegistry,
} from "./catalog"
import {
  extractPresentationProps,
  mergeInspectorPages,
  normalizeInspectorPageHref,
  type InspectorInstance,
  type InspectorPageLink,
} from "./model"

export type ScannedInspectorInstance = InspectorInstance & {
  element: HTMLElement
}

export type InspectorScanner = {
  getElement: (id: string) => HTMLElement | undefined
  scan: () => ScannedInspectorInstance[]
  scanPages: () => InspectorPageLink[]
}

const INSPECTABLE_SELECTOR = "[data-slot]"

function readAttributes(element: HTMLElement): Record<string, string> {
  return Object.fromEntries(
    [...element.attributes].map((attribute) => [
      attribute.name,
      attribute.value,
    ])
  )
}

function isVisible(element: HTMLElement): boolean {
  const view = element.ownerDocument.defaultView
  if (!view) return false

  const style = view.getComputedStyle(element)
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.visibility === "collapse"
  ) {
    return false
  }

  return [...element.getClientRects()].some(
    (rect) => rect.width > 0 && rect.height > 0
  )
}

function getPageLabel(element: HTMLAnchorElement, href: string): string {
  const value = [
    element.getAttribute("aria-label"),
    element.textContent,
    element.getAttribute("title"),
  ]
    .map((candidate) => candidate?.replace(/\s+/g, " ").trim() ?? "")
    .find(Boolean)
  return value?.slice(0, 80) || href
}

export function scanInspectorPages(document: Document): InspectorPageLink[] {
  const origin = document.location.origin
  const pages: InspectorPageLink[] = []

  try {
    const href = normalizeInspectorPageHref(document.location.href, origin)
    pages.push({ href, label: document.title.trim() || href })
  } catch {
    return pages
  }

  for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
    "a[href]"
  )) {
    const target = anchor.getAttribute("href")
    if (!target || target.startsWith("#") || anchor.hasAttribute("download")) {
      continue
    }

    try {
      const href = normalizeInspectorPageHref(target, origin)
      pages.push({ href, label: getPageLabel(anchor, href) })
    } catch {
      continue
    }

    if (pages.length >= 200) break
  }

  return mergeInspectorPages(pages)
}

export function createInspectorScanner(
  document: Document,
  registry: InspectorRegistry = ONDO_INSPECTOR_REGISTRY
): InspectorScanner {
  const elementIds = new WeakMap<HTMLElement, string>()
  let nextId = 1
  let elementsById = new Map<string, HTMLElement>()

  function getElementId(element: HTMLElement): string {
    const existing = elementIds.get(element)
    if (existing) return existing

    const id = `ondo-instance-${nextId}`
    nextId += 1
    elementIds.set(element, id)
    return id
  }

  function scan(): ScannedInspectorInstance[] {
    const instances: ScannedInspectorInstance[] = []
    const seenLogicalInstances = new Set<string>()
    const nextElementsById = new Map<string, HTMLElement>()
    const HTMLElementConstructor = document.defaultView?.HTMLElement

    if (!HTMLElementConstructor) {
      elementsById = nextElementsById
      return instances
    }

    for (const candidate of document.querySelectorAll(INSPECTABLE_SELECTOR)) {
      if (!(candidate instanceof HTMLElementConstructor)) continue

      const element = candidate as HTMLElement
      const attributes = readAttributes(element)
      const slot = attributes["data-slot"]
      const compositionName = resolveCompositionName(slot, registry)
      const componentName = resolveComponentName(undefined, slot, registry)
      const logicalId = attributes["data-instance"]
      const registryEntry = [
        ...registry.components,
        ...(registry.compositions ?? []),
      ].find((entry) => entry.slots.includes(slot ?? ""))

      const identities = [
        componentName
          ? ({ kind: "component", name: componentName } as const)
          : undefined,
        compositionName
          ? ({ kind: "composition", name: compositionName } as const)
          : undefined,
      ].filter((identity) => identity !== undefined)

      for (const identity of identities) {
        const logicalKey = logicalId
          ? `${identity.kind}:${identity.name}:${logicalId}`
          : undefined

        if (logicalKey && seenLogicalInstances.has(logicalKey)) continue
        if (logicalKey) seenLogicalInstances.add(logicalKey)

        const elementId = getElementId(element)
        const id = `${elementId}:${identity.kind}:${identity.name}`
        nextElementsById.set(id, element)
        instances.push({
          id,
          kind: identity.kind,
          name: identity.name,
          props: extractPresentationProps(
            attributes,
            registryEntry?.presentationAttributes
          ),
          visible: isVisible(element),
          element,
        })
      }
    }

    elementsById = nextElementsById
    return instances
  }

  return {
    getElement(id) {
      return elementsById.get(id)
    },
    scan,
    scanPages() {
      return scanInspectorPages(document)
    },
  }
}
