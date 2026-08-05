import { describe, expect, test } from "bun:test"

import { getBlockPreview } from "@/components/blocks"
import {
  BLOCK_CATEGORIES,
  FEATURED_BLOCK_NAMES,
  getBlockCategoryStaticParams,
  getBlockInstallCommand,
  getBlockNameStaticParams,
  getBlockPreviewUrl,
  getBlockScreenshotUrl,
  getBlockSourceLanguage,
  listBlockItems,
} from "@/lib/blocks"
import { getDictionary } from "@/lib/dictionaries"
import registry from "@/registry.json"

const items = [
  { name: "button", type: "registry:ui", files: [] },
  {
    name: "agent-workspace-01",
    type: "registry:block",
    description: "Agent workspace",
    categories: ["ai", "workspace"],
    files: [
      {
        path: "components/blocks/agent-workspace-01/page.tsx",
        type: "registry:page",
        target: "app/agent-workspace/page.tsx",
      },
    ],
    meta: { iframeHeight: "900px" },
  },
] as const

describe("Block catalog helpers", () => {
  test("lists only registry:block items and filters categories", () => {
    expect(listBlockItems(items)).toHaveLength(1)
    expect(listBlockItems(items, "ai").map((item) => item.name)).toEqual([
      "agent-workspace-01",
    ])
    expect(listBlockItems(items, "login")).toEqual([])
  })

  test("builds every static param", () => {
    expect(getBlockNameStaticParams(items)).toEqual([
      { name: "agent-workspace-01" },
    ])
    expect(getBlockCategoryStaticParams()).toEqual(
      BLOCK_CATEGORIES.map(({ slug }) => ({ category: slug }))
    )
  })

  test("builds namespaced commands and static asset URLs", () => {
    expect(getBlockInstallCommand("agent-workspace-01")).toBe(
      "npx shadcn@latest add @ondo-ui/agent-workspace-01"
    )
    expect(getBlockPreviewUrl("agent-workspace-01")).toBe(
      "/view/agent-workspace-01/"
    )
    expect(getBlockScreenshotUrl("agent-workspace-01", "dark")).toBe(
      "/r/styles/base-vega/agent-workspace-01-dark.png"
    )
  })

  test("maps source extensions to Shiki languages", () => {
    expect(getBlockSourceLanguage("page.tsx")).toBe("tsx")
    expect(getBlockSourceLanguage("data.ts")).toBe("ts")
    expect(getBlockSourceLanguage("fixture.json")).toBe("json")
  })

  test("resolves only registered Block preview components", () => {
    expect(getBlockPreview("agent-workspace-01")).toBeTypeOf("function")
    expect(getBlockPreview("unknown-block")).toBeUndefined()
  })

  test("localizes Block viewer labels", () => {
    expect(getDictionary("en").blocks.viewer.preview).toBe("Preview")
    expect(getDictionary("ko").blocks.viewer.preview).toBe("미리 보기")
  })

  test("publishes agent-workspace-01 in featured, AI, and workspace views", () => {
    expect(FEATURED_BLOCK_NAMES).toContain("agent-workspace-01")
    expect(
      listBlockItems(registry.items, "ai").map((item) => item.name)
    ).toEqual(["agent-workspace-01"])
    expect(
      listBlockItems(registry.items, "workspace").map((item) => item.name)
    ).toEqual(["agent-workspace-01"])
  })

  test("localizes Block catalog labels", () => {
    expect(getDictionary("en").blocks.featured).toBe("Featured")
    expect(getDictionary("ko").blocks.featured).toBe("추천")
    expect(getDictionary("en").blocks.browseComponents).toBe(
      "Browse components"
    )
  })
})
