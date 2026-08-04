import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

type RegistryItem = {
  name: string
  type?: string
  dependencies?: string[]
  registryDependencies?: string[]
}

type Registry = {
  items: RegistryItem[]
}

describe("registry dependency namespaces", () => {
  async function readRegistry() {
    return JSON.parse(
      await readFile(new URL("../registry.json", import.meta.url), "utf8")
    ) as Registry
  }

  test("keeps composition dependencies in the Ondo registry", async () => {
    const registry = await readRegistry()
    const numberBadge = registry.items.find(
      (item) => item.name === "number-badge"
    )

    expect(numberBadge?.registryDependencies).toContain(
      "@ondo-ui/number-count"
    )
  })

  test("namespaces every dependency that belongs to the Ondo registry", async () => {
    const registry = await readRegistry()
    const itemNames = new Set(registry.items.map((item) => item.name))
    const bareInternalDependencies = registry.items.flatMap((item) =>
      (item.registryDependencies ?? [])
        .filter((dependency) => itemNames.has(dependency))
        .map((dependency) => `${item.name} -> ${dependency}`)
    )

    expect(bareInternalDependencies).toEqual([])
  })

  test("registers agent workspace as an explicit Block with namespaced dependencies", async () => {
    const registry = await readRegistry()
    const block = registry.items.find((item) => item.name === "agent-workspace")

    expect(block?.type).toBe("registry:block")
    expect(block?.dependencies).toContain("@tabler/icons-react")
    expect(block?.registryDependencies).toEqual([
      "@ondo-ui/attachment",
      "@ondo-ui/badge",
      "@ondo-ui/bubble",
      "@ondo-ui/button",
      "@ondo-ui/collapsible",
      "@ondo-ui/dropdown-menu",
      "@ondo-ui/empty",
      "@ondo-ui/input-group",
      "@ondo-ui/message",
      "@ondo-ui/message-scroller",
      "@ondo-ui/progress",
      "@ondo-ui/sheet",
      "@ondo-ui/sidebar",
      "@ondo-ui/tooltip",
      "@ondo-ui/utils",
    ])
  })
})
