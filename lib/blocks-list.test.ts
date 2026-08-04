import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

import { blocksList } from "@/lib/blocks-list"

type Registry = {
  items: Array<{
    name: string
    type: string
    files?: Array<{ path: string }>
    registryDependencies?: string[]
  }>
}

describe("blocksList", () => {
  test("matches every public registry block", async () => {
    const registry = JSON.parse(
      await readFile(new URL("../registry.json", import.meta.url), "utf8")
    ) as Registry
    const registryBlocks = registry.items.filter(
      (item) => item.type === "registry:block"
    )

    expect(blocksList.map((item) => item.name)).toEqual(
      registryBlocks.map((item) => item.name)
    )
    expect(registryBlocks[0].files?.map((file) => file.path)).toEqual([
      "components/blocks/agent-workspace/agent-workspace.tsx",
      "components/blocks/agent-workspace/workspace-sidebar.tsx",
      "components/blocks/agent-workspace/workspace-thread.tsx",
      "components/blocks/agent-workspace/workspace-artifacts.tsx",
      "components/blocks/agent-workspace/workspace-data.ts",
    ])
  })
})
