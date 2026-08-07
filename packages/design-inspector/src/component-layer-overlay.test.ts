import { describe, expect, test } from "bun:test"

import {
  collectComponentLayers,
  resolveComponentLayerHit,
} from "./component-layer-overlay"
import type { ScannedInspectorInstance } from "./scanner"

function element(
  rect: { height: number; left: number; top: number; width: number },
  inspectorUi = false,
  parentElement: HTMLElement | null = null
): HTMLElement {
  const target = {
    parentElement,
    closest() {
      return inspectorUi ? ({} as Element) : null
    },
    contains(candidate: Node) {
      let current = candidate as HTMLElement | null
      while (current) {
        if (current === (target as unknown as HTMLElement)) return true
        current = current.parentElement
      }
      return false
    },
    getBoundingClientRect() {
      return {
        ...rect,
        bottom: rect.top + rect.height,
        right: rect.left + rect.width,
      } as DOMRect
    },
  }

  return target as unknown as HTMLElement
}

function instance(
  id: string,
  name: string,
  target: HTMLElement,
  visible = true
): ScannedInspectorInstance {
  return {
    element: target,
    id,
    kind: "component",
    name,
    props: {},
    visible,
  }
}

describe("component layer overlay", () => {
  test("groups names sharing an element and positions the upper-right label", () => {
    const target = element({ height: 80, left: 900, top: -20, width: 200 })
    const layers = collectComponentLayers(
      [
        instance("button-1", "button", target),
        {
          ...instance("composition-1", "empty-view", target),
          kind: "composition",
        },
      ],
      1_000,
      800
    )

    expect(layers).toEqual([
      {
        height: 80,
        id: "button-1",
        ids: ["button-1", "composition-1"],
        label: "Button · Empty View",
        labels: ["Button", "Empty View"],
        labelRight: 100,
        labelTop: 20,
        left: 900,
        top: -20,
        width: 200,
      },
    ])
  })

  test("omits hidden, off-screen, and inspector UI elements", () => {
    const layers = collectComponentLayers(
      [
        instance(
          "hidden",
          "button",
          element({ height: 20, left: 10, top: 10, width: 20 }),
          false
        ),
        instance(
          "off-screen",
          "select",
          element({ height: 20, left: 10, top: 900, width: 20 })
        ),
        instance(
          "inspector-ui",
          "button",
          element({ height: 20, left: 10, top: 10, width: 20 }, true)
        ),
      ],
      1_000,
      800
    )

    expect(layers).toEqual([])
  })

  test("applies the layer limit after excluding off-screen components", () => {
    const offScreen = Array.from({ length: 300 }, (_, index) =>
      instance(
        `off-screen-${index}`,
        "button",
        element({ height: 20, left: 10, top: 900 + index, width: 20 })
      )
    )
    const visible = instance(
      "visible",
      "separator",
      element({ height: 1, left: 10, top: 100, width: 200 })
    )

    expect(collectComponentLayers([...offScreen, visible], 1_000, 800)).toEqual(
      [
        {
          height: 1,
          id: "visible",
          ids: ["visible"],
          label: "Separator",
          labels: ["Separator"],
          labelRight: 0,
          labelTop: 0,
          left: 10,
          top: 100,
          width: 200,
        },
      ]
    )
  })

  test("shows only the deepest component name and summarizes nested candidates", () => {
    const card = element({ height: 200, left: 0, top: 0, width: 300 })
    const separator = element(
      { height: 40, left: 20, top: 20, width: 240 },
      false,
      card
    )
    const button = element(
      { height: 32, left: 40, top: 24, width: 120 },
      false,
      separator
    )

    const hit = resolveComponentLayerHit(
      [
        instance("card", "card", card),
        instance("separator", "separator", separator),
        instance("button", "button", button),
      ],
      [button, separator, card],
      80,
      30,
      1_000,
      800
    )

    expect(hit).toEqual({
      candidateIds: ["button", "separator", "card"],
      layer: {
        height: 32,
        id: "button",
        ids: ["button"],
        label: "Button +2",
        labels: ["Button"],
        labelRight: 0,
        labelTop: 0,
        left: 40,
        top: 24,
        width: 120,
      },
    })
  })

  test("prefers the topmost component for overlapping siblings", () => {
    const parent = element({ height: 100, left: 0, top: 0, width: 100 })
    const button = element(
      { height: 40, left: 10, top: 10, width: 80 },
      false,
      parent
    )
    const separator = element(
      { height: 40, left: 10, top: 10, width: 80 },
      false,
      parent
    )

    const hit = resolveComponentLayerHit(
      [
        instance("button", "button", button),
        instance("separator", "separator", separator),
      ],
      [separator, button],
      20,
      20,
      100,
      100
    )

    expect(hit?.candidateIds).toEqual(["separator", "button"])
    expect(hit?.layer.label).toBe("Separator +1")
  })
})
