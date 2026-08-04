import { describe, expect, test } from "bun:test"

import {
  buildOndoDocsResult,
  classifyDocsAddress,
  classifyOndoDocsItem,
  parseOndoDocsArgs,
  runOndoDocs,
} from "../packages/ondo-ui-cli/bin/ondo-docs.mjs"

const registry = {
  items: [
    { name: "button", type: "registry:ui" },
    {
      name: "empty-view",
      type: "registry:component",
      files: [{ path: "components/compositions/empty-view.tsx" }],
    },
    { name: "theme", type: "registry:theme" },
    { name: "utils", type: "registry:lib" },
  ],
}

describe("Ondo docs resolver", () => {
  test("classifies Ondo and external addresses", () => {
    expect(classifyDocsAddress("button")).toEqual({
      kind: "ondo",
      name: "button",
    })
    expect(classifyDocsAddress("@ondo-ui/button")).toEqual({
      kind: "ondo",
      name: "button",
    })
    expect(classifyDocsAddress("@acme/button")).toEqual({
      kind: "external",
      address: "@acme/button",
    })
    expect(classifyDocsAddress("owner/repo/button")).toEqual({
      kind: "external",
      address: "owner/repo/button",
    })
  })

  test("maps registry items to Ondo documentation categories", () => {
    expect(classifyOndoDocsItem(registry.items[0])).toBe("component")
    expect(classifyOndoDocsItem(registry.items[1])).toBe("composition")
    expect(classifyOndoDocsItem(registry.items[2])).toBe("theming")
    expect(classifyOndoDocsItem(registry.items[3])).toBe("registry")
  })

  test("builds deterministic component and composition links", () => {
    expect(buildOndoDocsResult(registry.items[0])).toEqual({
      component: "button",
      category: "component",
      links: {
        docs: "https://ui.ondo.dou.so/docs/components/button",
        registry: "https://ui.ondo.dou.so/r/button.json",
      },
    })
    expect(buildOndoDocsResult(registry.items[1])).toEqual({
      component: "empty-view",
      category: "composition",
      links: {
        docs: "https://ui.ondo.dou.so/docs/compositions/empty-view",
        registry: "https://ui.ondo.dou.so/r/empty-view.json",
      },
    })
  })

  test("omits a docs link for registry-only items", () => {
    expect(buildOndoDocsResult(registry.items[3])).toEqual({
      component: "utils",
      category: "registry",
      links: {
        registry: "https://ui.ondo.dou.so/r/utils.json",
      },
    })
  })

  test("parses item names and JSON output without treating flag values as items", () => {
    expect(parseOndoDocsArgs(["button", "empty-view", "--json"])).toEqual({
      items: ["button", "empty-view"],
      json: true,
      forwardedArgs: ["button", "empty-view", "--json"],
    })
    expect(
      parseOndoDocsArgs(["button", "--cwd", "/tmp/project", "-b", "base"])
    ).toEqual({
      items: ["button"],
      json: false,
      forwardedArgs: ["button", "--cwd", "/tmp/project", "-b", "base"],
    })
  })

  test("requires at least one documentation address", () => {
    expect(() => parseOndoDocsArgs(["--json"])).toThrow(
      "At least one documentation item is required"
    )
  })

  test("prints deterministic JSON for Ondo items in requested order", async () => {
    const output: string[] = []
    const status = await runOndoDocs(["empty-view", "button", "--json"], {
      fetchRegistry: async () => registry,
      log: (value: string) => output.push(value),
    })

    expect(status).toBe(0)
    expect(JSON.parse(output.join("\n"))).toEqual({
      registry: "@ondo-ui",
      base: "base",
      results: [
        buildOndoDocsResult(registry.items[1]),
        buildOndoDocsResult(registry.items[0]),
      ],
    })
  })

  test("delegates external addresses without fetching the Ondo registry", async () => {
    const calls: unknown[] = []
    let fetched = false
    const status = await runOndoDocs(["@acme/button", "--json"], {
      fetchRegistry: async () => {
        fetched = true
        return registry
      },
      runShadcn: (command: string, args: string[]) => {
        calls.push({ command, args })
        return 0
      },
    })

    expect(status).toBe(0)
    expect(fetched).toBe(false)
    expect(calls).toEqual([
      { command: "docs", args: ["@acme/button", "--json"] },
    ])
  })

  test("rejects mixed Ondo and external documentation sources", async () => {
    await expect(
      runOndoDocs(["button", "@acme/card"], {})
    ).rejects.toThrow(
      "Run Ondo and external documentation requests separately"
    )
  })

  test("rejects invalid registries and unknown Ondo items", async () => {
    await expect(
      runOndoDocs(["button"], {
        fetchRegistry: async () => ({ invalid: true }),
      })
    ).rejects.toThrow("The Ondo registry returned an invalid registry index")

    await expect(
      runOndoDocs(["missing"], {
        fetchRegistry: async () => registry,
      })
    ).rejects.toThrow('Ondo registry item "missing" was not found.')
  })

  test("prints text links and warns when an item has no dedicated docs page", async () => {
    const output: string[] = []
    const warnings: string[] = []
    const status = await runOndoDocs(["button", "utils"], {
      fetchRegistry: async () => registry,
      log: (value: string) => output.push(value),
      warn: (value: string) => warnings.push(value),
    })

    expect(status).toBe(0)
    expect(output.join("\n")).toContain("button")
    expect(output.join("\n")).toContain(
      "https://ui.ondo.dou.so/docs/components/button"
    )
    expect(output.join("\n")).toContain("https://ui.ondo.dou.so/r/utils.json")
    expect(warnings.join("\n")).toContain(
      'Ondo registry item "utils" does not have a dedicated docs page.'
    )
  })
})
