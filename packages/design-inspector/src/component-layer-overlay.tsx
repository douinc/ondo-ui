import type { ScannedInspectorInstance } from "./scanner"

export type ComponentLayer = {
  height: number
  id: string
  ids: string[]
  label: string
  labels: string[]
  labelRight: number
  labelTop: number
  left: number
  top: number
  width: number
}

export type ComponentLayerHit = {
  candidateIds: string[]
  layer: ComponentLayer
}

const INSPECTOR_UI_SELECTOR = "[data-inspector-ui]"
const MAX_COMPONENT_LAYERS = 300

type ComponentLayerGroup = {
  element: HTMLElement
  ids: string[]
  instances: ScannedInspectorInstance[]
  names: Set<string>
}

export function formatComponentLayerName(value: string): string {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")
}

function roundPosition(value: number): number {
  return Math.round(value * 100) / 100
}

function collectComponentLayerGroups(
  instances: ScannedInspectorInstance[]
): ComponentLayerGroup[] {
  const groups = new Map<HTMLElement, ComponentLayerGroup>()

  for (const instance of instances) {
    if (!instance.visible || instance.element.closest(INSPECTOR_UI_SELECTOR)) {
      continue
    }

    const existing = groups.get(instance.element)
    if (existing) {
      existing.ids.push(instance.id)
      existing.instances.push(instance)
      existing.names.add(instance.name)
      continue
    }

    groups.set(instance.element, {
      element: instance.element,
      ids: [instance.id],
      instances: [instance],
      names: new Set([instance.name]),
    })
  }

  return [...groups.values()]
}

function createComponentLayer(
  group: ComponentLayerGroup,
  viewportWidth: number,
  viewportHeight: number
): ComponentLayer | undefined {
  const rect = group.element.getBoundingClientRect()
  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    rect.right < 0 ||
    rect.bottom < 0 ||
    rect.left > viewportWidth ||
    rect.top > viewportHeight
  ) {
    return undefined
  }

  return {
    id: group.ids[0],
    ids: group.ids,
    label: [...group.names].map(formatComponentLayerName).join(" · "),
    labels: group.instances.map((instance) =>
      formatComponentLayerName(instance.name)
    ),
    left: roundPosition(rect.left),
    top: roundPosition(rect.top),
    width: roundPosition(rect.width),
    height: roundPosition(rect.height),
    labelTop: roundPosition(Math.max(0, -rect.top)),
    labelRight: roundPosition(Math.max(0, rect.right - viewportWidth)),
  }
}

export function collectComponentLayers(
  instances: ScannedInspectorInstance[],
  viewportWidth: number,
  viewportHeight: number
): ComponentLayer[] {
  const layers: ComponentLayer[] = []

  for (const group of collectComponentLayerGroups(instances)) {
    const layer = createComponentLayer(group, viewportWidth, viewportHeight)
    if (!layer) continue

    layers.push(layer)

    if (layers.length >= MAX_COMPONENT_LAYERS) break
  }

  return layers
}

function getElementDepth(element: HTMLElement): number {
  let depth = 0
  let current = element.parentElement

  while (current) {
    depth += 1
    current = current.parentElement
  }

  return depth
}

function getHitStackIndex(
  element: HTMLElement,
  elementsAtPoint: readonly Element[]
): number {
  const index = elementsAtPoint.findIndex(
    (candidate) => candidate === element || element.contains(candidate)
  )
  return index < 0 ? Number.MAX_SAFE_INTEGER : index
}

/**
 * Resolves one inspectable target beneath the pointer. DOM hit-test order wins,
 * then the deepest and smallest component wins for nested candidates.
 */
export function resolveComponentLayerHit(
  instances: ScannedInspectorInstance[],
  elementsAtPoint: readonly Element[],
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number
): ComponentLayerHit | undefined {
  const candidates = collectComponentLayerGroups(instances)
    .map((group) => {
      const layer = createComponentLayer(group, viewportWidth, viewportHeight)
      if (!layer) return undefined

      const right = layer.left + layer.width
      const bottom = layer.top + layer.height
      if (
        clientX < layer.left ||
        clientX > right ||
        clientY < layer.top ||
        clientY > bottom
      ) {
        return undefined
      }

      return {
        depth: getElementDepth(group.element),
        group,
        hitStackIndex: getHitStackIndex(group.element, elementsAtPoint),
        layer,
      }
    })
    .filter((candidate) => candidate !== undefined)
    .sort((left, right) => {
      if (left.hitStackIndex !== right.hitStackIndex) {
        return left.hitStackIndex - right.hitStackIndex
      }
      if (left.depth !== right.depth) return right.depth - left.depth

      return (
        left.layer.width * left.layer.height -
        right.layer.width * right.layer.height
      )
    })

  const primary = candidates[0]
  if (!primary) return undefined

  const candidateIds = candidates.flatMap(({ group }) => group.ids)
  const extraCount = candidateIds.length - 1
  const primaryName = formatComponentLayerName(primary.group.instances[0].name)

  return {
    candidateIds,
    layer: {
      ...primary.layer,
      label: extraCount > 0 ? `${primaryName} +${extraCount}` : primaryName,
    },
  }
}

export function areComponentLayersEqual(
  left: ComponentLayer[],
  right: ComponentLayer[]
): boolean {
  return (
    left.length === right.length &&
    left.every((layer, index) => {
      const candidate = right[index]
      return (
        candidate?.id === layer.id &&
        candidate.ids.length === layer.ids.length &&
        candidate.ids.every((id, idIndex) => id === layer.ids[idIndex]) &&
        candidate.label === layer.label &&
        candidate.labels.length === layer.labels.length &&
        candidate.labels.every(
          (label, labelIndex) => label === layer.labels[labelIndex]
        ) &&
        candidate.left === layer.left &&
        candidate.top === layer.top &&
        candidate.width === layer.width &&
        candidate.height === layer.height &&
        candidate.labelTop === layer.labelTop &&
        candidate.labelRight === layer.labelRight
      )
    })
  )
}
