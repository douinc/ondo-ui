import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

type RegistryItem = {
  name: string
  type: string
  registryDependencies?: string[]
  files?: {
    path: string
    type: string
    target?: string
  }[]
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

    expect(numberBadge?.registryDependencies).toContain("@ondo-ui/number-count")
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

  test("registers agent-workspace-01 as a complete namespaced Block", async () => {
    const registry = await readRegistry()
    const block = registry.items.find(
      (item) => item.name === "agent-workspace-01"
    )

    expect(block?.type).toBe("registry:block")
    expect(block?.files).toContainEqual({
      path: "components/blocks/agent-workspace-01/page.tsx",
      type: "registry:page",
      target: "app/agent-workspace/page.tsx",
    })
    expect(block?.files?.map((file) => file.path).sort()).toEqual(
      [
        "components/blocks/agent-workspace-01/data.ts",
        "components/blocks/agent-workspace-01/page.tsx",
        "components/blocks/agent-workspace-01/components/agent-sidebar.tsx",
        "components/blocks/agent-workspace-01/components/artifact-panel.tsx",
        "components/blocks/agent-workspace-01/components/conversation-panel.tsx",
        "components/blocks/agent-workspace-01/components/conversation-row.tsx",
        "components/blocks/agent-workspace-01/components/prompt-composer.tsx",
        "components/blocks/agent-workspace-01/components/reader-rail.tsx",
        "components/blocks/agent-workspace-01/components/task-progress.tsx",
        "components/blocks/agent-workspace-01/components/workspace-header.tsx",
      ].sort()
    )
    expect(
      block?.registryDependencies?.every((name) => name.startsWith("@ondo-ui/"))
    ).toBe(true)
  })
})
