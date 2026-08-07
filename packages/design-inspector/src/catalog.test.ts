import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

import {
  ONDO_COMPONENT_NAMES,
  ONDO_COMPOSITION_NAMES,
  resolveComponentName,
  resolveCompositionName,
} from "./catalog"

const REGISTRY_PATH = new URL("../../../registry.json", import.meta.url)

describe("Design Inspector catalog", () => {
  test("matches every public registry component and composition", async () => {
    const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf8")) as {
      items: Array<{
        name: string
        type: string
        files?: Array<{ path: string }>
      }>
    }

    const components = registry.items
      .filter((item) => item.type === "registry:ui")
      .map((item) => item.name)
      .sort()
    const compositions = registry.items
      .filter(
        (item) =>
          item.type === "registry:component" &&
          item.files?.some((file) =>
            file.path.startsWith("components/compositions/")
          )
      )
      .map((item) => item.name)
      .sort()

    const catalogComponents: string[] = [...ONDO_COMPONENT_NAMES].sort()
    const catalogCompositions: string[] = [...ONDO_COMPOSITION_NAMES].sort()

    expect(catalogComponents).toEqual(components)
    expect(catalogCompositions).toEqual(compositions)
  })

  test("resolves explicit names, then registry slots, then Ondo defaults", () => {
    expect(resolveComponentName("button", "card")).toBe("button")
    expect(resolveComponentName(undefined, "select-trigger")).toBe("select")
    expect(resolveComponentName(undefined, "dropdown-menu-trigger")).toBe(
      "dropdown-menu"
    )
    expect(resolveComponentName(undefined, "combobox-trigger")).toBe("combobox")
    expect(resolveComponentName(undefined, "resizable-panel-group")).toBe(
      "resizable"
    )
    expect(resolveComponentName(undefined, "card-header")).toBeUndefined()
    expect(resolveCompositionName("empty-view")).toBe("empty-view")
    expect(resolveCompositionName("../unsafe")).toBeUndefined()
  })

  test("falls back to Ondo defaults for slots a custom registry omits", () => {
    const registry = {
      components: [{ name: "menu", slots: ["app-menu-trigger"] }],
    }

    expect(resolveComponentName(undefined, "combobox-trigger", registry)).toBe(
      "combobox"
    )
    expect(resolveComponentName(undefined, "button", registry)).toBe("button")
  })

  test("accepts an application registry for custom slots", () => {
    const registry = {
      components: [
        { name: "menu", slots: ["app-menu-trigger"] },
      ],
      compositions: [{ name: "dashboard-shell", slots: ["dashboard-shell"] }],
    }

    expect(resolveComponentName(undefined, "app-menu-trigger", registry)).toBe(
      "menu"
    )
    expect(resolveCompositionName("dashboard-shell", registry)).toBe(
      "dashboard-shell"
    )
  })
})
