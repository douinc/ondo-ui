import { describe, expect, test } from "bun:test"
import { mkdtempSync, symlinkSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"

import {
  buildShadcnArgs,
  getFrameworkItems,
  getShadcnEnvironment,
  isDirectInvocation,
  mergeOndoRegistry,
} from "../packages/ondo-ui-cli/bin/ondo-ui.mjs"
import {
  buildRegistryChoices,
  classifyRegistryItem,
  getSelectableRegistryItems,
  normalizeOndoItemAddress,
} from "../packages/ondo-ui-cli/bin/registry-menu.mjs"

describe("Ondo registry menu", () => {
  test("classifies registry UI items as Components", () => {
    expect(classifyRegistryItem({ name: "button", type: "registry:ui" })).toBe(
      "component"
    )
  })

  test("classifies composition paths separately from system components", () => {
    expect(
      classifyRegistryItem({
        name: "empty-view",
        type: "registry:component",
        files: [{ path: "components/compositions/empty-view.tsx" }],
      })
    ).toBe("composition")
    expect(
      classifyRegistryItem({
        name: "theme-provider",
        type: "registry:component",
        files: [{ path: "components/theme-provider.tsx" }],
      })
    ).toBeNull()
  })

  test("keeps only Components and Compositions in selectable groups", () => {
    const result = getSelectableRegistryItems({
      items: [
        { name: "button", type: "registry:ui" },
        {
          name: "empty-view",
          type: "registry:component",
          files: [{ path: "components/compositions/empty-view.tsx" }],
        },
        {
          name: "theme-provider",
          type: "registry:component",
          files: [{ path: "components/theme-provider.tsx" }],
        },
      ],
    })

    expect(result.components.map((item) => item.name)).toEqual(["button"])
    expect(result.compositions.map((item) => item.name)).toEqual(["empty-view"])
  })

  test("normalizes bare names without changing registry addresses", () => {
    expect(normalizeOndoItemAddress("button")).toBe("@ondo-ui/button")
    expect(normalizeOndoItemAddress("@acme/button")).toBe("@acme/button")
    expect(normalizeOndoItemAddress("https://example.com/button.json")).toBe(
      "https://example.com/button.json"
    )
    expect(normalizeOndoItemAddress("./button.json")).toBe("./button.json")
  })

  test("builds grouped prompt choices", () => {
    const choices = buildRegistryChoices({
      items: [
        { name: "button", type: "registry:ui", description: "A button." },
        {
          name: "empty-view",
          type: "registry:component",
          files: [{ path: "components/compositions/empty-view.tsx" }],
        },
      ],
    })

    expect(choices).toEqual([
      { title: "Components", value: "__group_components", disabled: true },
      { title: "button — A button.", value: "button" },
      { title: "Compositions", value: "__group_compositions", disabled: true },
      { title: "empty-view", value: "empty-view" },
    ])
  })
})

describe("Ondo init CLI", () => {
  test("runs when invoked through a package manager bin symlink", () => {
    const directory = mkdtempSync(resolve(tmpdir(), "ondo-cli-test-"))
    const entryPath = resolve(directory, "ondo-ui")
    const modulePath = resolve("packages/ondo-ui-cli/bin/ondo-ui.mjs")

    try {
      symlinkSync(modulePath, entryPath)
      expect(isDirectInvocation(entryPath, modulePath)).toBe(true)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  test("selects theme and provider for React frameworks", () => {
    expect(getFrameworkItems("next")).toEqual(["theme", "theme-provider"])
    expect(getFrameworkItems("vite")).toEqual(["theme", "theme-provider"])
    expect(getFrameworkItems("start")).toEqual(["theme", "theme-provider"])
    expect(getFrameworkItems("react-router")).toEqual([
      "theme",
      "theme-provider",
    ])
    expect(getFrameworkItems("laravel")).toEqual([
      "theme",
      "theme-provider",
    ])
  })

  test("selects only the theme for Astro", () => {
    expect(getFrameworkItems("astro")).toEqual(["theme"])
  })

  test("builds shadcn init args with direct registry URLs", () => {
    expect(buildShadcnArgs(["-t", "next"], "next")).toEqual([
      "init",
      "-t",
      "next",
      "--yes",
      "--no-monorepo",
      "https://ui.ondo.dou.so/r/theme.json",
      "https://ui.ondo.dou.so/r/theme-provider.json",
    ])
  })

  test("does not pass the Laravel template to shadcn", () => {
    expect(buildShadcnArgs(["-t", "laravel"], "laravel")).toEqual([
      "init",
      "--yes",
      "--no-monorepo",
      "https://ui.ondo.dou.so/r/theme.json",
      "https://ui.ondo.dou.so/r/theme-provider.json",
    ])
  })

  test("preserves existing registries while adding Ondo", () => {
    expect(
      mergeOndoRegistry({
        style: "base-nova",
        registries: { "@acme": "https://example.com/r/{name}.json" },
      })
    ).toEqual({
      style: "base-nova",
      registries: {
        "@acme": "https://example.com/r/{name}.json",
        "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json",
      },
    })
  })

  test("allows Laravel starter dependencies at the workspace root", () => {
    expect(
      getShadcnEnvironment("laravel", { PATH: "/usr/bin", NODE_ENV: "test" })
    ).toEqual({
      PATH: "/usr/bin",
      NODE_ENV: "test",
      npm_config_ignore_workspace_root_check: "true",
    })
  })

  test("does not change the package manager environment for other frameworks", () => {
    expect(
      getShadcnEnvironment("next", { PATH: "/usr/bin", NODE_ENV: "test" })
    ).toEqual({ PATH: "/usr/bin", NODE_ENV: "test" })
  })
})
