import { describe, expect, test } from "bun:test"

import { createBlockFileTree, loadBlockDisplayData } from "@/lib/block-source"

describe("Block source preparation", () => {
  test("builds a deterministic target-based Block file tree", () => {
    const files = [
      { path: "source/page.tsx", target: "app/agent-workspace/page.tsx" },
      {
        path: "source/reader-rail.tsx",
        target:
          "components/blocks/agent-workspace-01/components/reader-rail.tsx",
      },
    ] as const

    expect(createBlockFileTree(files)).toEqual([
      {
        name: "app",
        children: [
          {
            name: "agent-workspace",
            children: [
              { name: "page.tsx", path: "app/agent-workspace/page.tsx" },
            ],
          },
        ],
      },
      {
        name: "components",
        children: [
          {
            name: "blocks",
            children: [
              {
                name: "agent-workspace-01",
                children: [
                  {
                    name: "components",
                    children: [
                      {
                        name: "reader-rail.tsx",
                        path: "components/blocks/agent-workspace-01/components/reader-rail.tsx",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
    expect(files[0].target).toBe("app/agent-workspace/page.tsx")
  })

  test("loads and highlights declared source files", async () => {
    const data = await loadBlockDisplayData({
      name: "test-block",
      type: "registry:block",
      files: [
        {
          path: "lib/blocks.ts",
          type: "registry:file",
          target: "lib/blocks.ts",
        },
      ],
    })

    expect(data.files[0]?.path).toBe("lib/blocks.ts")
    expect(data.files[0]?.source).toContain("FEATURED_BLOCK_NAMES")
    expect(data.files[0]?.highlightedContent).toContain("<pre")
    expect(data.tree).toEqual([
      {
        name: "lib",
        children: [{ name: "blocks.ts", path: "lib/blocks.ts" }],
      },
    ])
  })

  test("reports the missing registry source and preserves its cause", async () => {
    try {
      await loadBlockDisplayData({
        name: "missing-block",
        type: "registry:block",
        files: [
          {
            path: "missing/block-file.tsx",
            type: "registry:file",
          },
        ],
      })
      throw new Error("Expected missing source to reject")
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe(
        "Block source file not found: missing/block-file.tsx"
      )
      expect((error as Error).cause).toBeInstanceOf(Error)
    }
  })
})
