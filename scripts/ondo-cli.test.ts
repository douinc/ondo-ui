import { describe, expect, test } from "bun:test"
import { mkdtempSync, symlinkSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"

import {
  buildShadcnArgs,
  getSelectableNames,
  getFrameworkItems,
  getShadcnEnvironment,
  isDirectInvocation,
  mergeOndoRegistry,
  parseAddArgs,
  parseCommand,
  PUBLIC_COMMANDS,
  run,
  runAdd,
} from "../packages/ondo-ui-cli/bin/ondo-ui.mjs"
import {
  buildRegistryChoices,
  classifyRegistryItem,
  getSelectableRegistryItems,
  normalizeOndoItemAddress,
} from "../packages/ondo-ui-cli/bin/registry-menu.mjs"
import {
  buildShadcnCommandArgs,
  runShadcn,
} from "../packages/ondo-ui-cli/bin/shadcn-process.mjs"

type TestRegistry = {
  items: Array<{
    name: string
    type: string
    description?: string
    files?: Array<{ path: string }>
  }>
}

type RegistryGroups = {
  components: Array<{ name: string }>
  compositions: Array<{ name: string }>
}

type PromptChoice = {
  title: string
  value: string
  disabled?: boolean
}

describe("shadcn process adapter", () => {
  test("preserves command and arguments", () => {
    expect(buildShadcnCommandArgs("search", ["@ondo-ui", "--json"])).toEqual([
      "search",
      "@ondo-ui",
      "--json",
    ])
    expect(buildShadcnCommandArgs("registry", ["validate"])).toEqual([
      "registry",
      "validate",
    ])
  })

  test("invokes shadcn with the project options", () => {
    let invocation: unknown
    const status = runShadcn("search", ["@ondo-ui", "--json"], {
      cwd: "/tmp/ondo-project",
      env: { TEST_ENV: "1" },
      spawnSync(
        file: string,
        args: string[],
        options: { cwd?: string; env?: Record<string, string>; stdio?: string }
      ) {
        invocation = { file, args, options }
        return { status: 0 }
      },
    })

    expect(status).toBe(0)
    expect(invocation).toEqual({
      file: process.platform === "win32" ? "npx.cmd" : "npx",
      args: ["--yes", "shadcn@latest", "search", "@ondo-ui", "--json"],
      options: {
        cwd: "/tmp/ondo-project",
        env: { TEST_ENV: "1" },
        stdio: "inherit",
      },
    })
  })
})

describe("Ondo command surface", () => {
  const registry = {
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
  } satisfies TestRegistry

  test("parses a command without changing its arguments", () => {
    expect(parseCommand(["search", "@ondo-ui", "--json"])).toEqual({
      command: "search",
      args: ["@ondo-ui", "--json"],
    })
  })

  test("parses add names and supported flags separately", () => {
    expect(parseAddArgs(["button", "empty-view", "--cwd", "/tmp/project", "--dry-run"])).toEqual({
      components: ["button", "empty-view"],
      args: ["--cwd", "/tmp/project", "--dry-run"],
      all: false,
    })

    expect(parseAddArgs(["-a"])).toEqual({
      components: [],
      args: [],
      all: true,
    })
  })

  test("selects only Components and Compositions for all", () => {
    expect(getSelectableNames(registry, "all")).toEqual([
      "button",
      "empty-view",
    ])
  })

  test("delegates explicit add names and flags", async () => {
    let invocation: unknown
    const status = await runAdd(["button", "--dry-run"], {
      runShadcn(command: string, args: string[]) {
        invocation = { command, args }
        return 0
      },
    })

    expect(status).toBe(0)
    expect(invocation).toEqual({
      command: "add",
      args: ["@ondo-ui/button", "--dry-run"],
    })
  })

  test("uses an injected menu and delegates all selectable items", async () => {
    let invocation: unknown
    const status = await runAdd(["--all"], {
      fetchRegistry: async () => registry,
      runShadcn(command: string, args: string[]) {
        invocation = { command, args }
        return 0
      },
    })

    expect(status).toBe(0)
    expect(invocation).toEqual({
      command: "add",
      args: ["@ondo-ui/button", "@ondo-ui/empty-view"],
    })
  })

  test("returns without spawning shadcn when the menu is empty", async () => {
    let invoked = false
    const status = await runAdd([], {
      fetchRegistry: async () => registry,
      prompt: async () => ({ items: [] }),
      runShadcn() {
        invoked = true
        return 0
      },
    })

    expect(status).toBe(0)
    expect(invoked).toBe(false)
  })

  test("routes docs through the Ondo docs resolver", async () => {
    const calls: unknown[] = []
    const status = await run(["docs", "button", "--json"], {
      runDocs: async (args: string[]) => {
        calls.push(args)
        return 0
      },
    })

    expect(status).toBe(0)
    expect(calls).toEqual([["button", "--json"]])
  })

  test("forwards remaining public commands and maps list to search", async () => {
    const invocations: Array<{ command: string; args: string[] }> = []
    for (const command of PUBLIC_COMMANDS.filter(
      (item) => item !== "init" && item !== "add" && item !== "docs"
    )) {
      const status = await run([command, "--json"], {
        runShadcn(forwardedCommand: string, args: string[]) {
          invocations.push({ command: forwardedCommand, args })
          return 0
        },
      })
      expect(status).toBe(0)
    }

    expect(invocations).toContainEqual({ command: "search", args: ["--json"] })
    expect(invocations).toContainEqual({
      command: "add",
      args: ["--json", "--diff"],
    })
    expect(invocations).toContainEqual({ command: "registry", args: ["--json"] })
    expect(invocations).not.toContainEqual({ command: "list", args: ["--json"] })
  })
})

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
    } satisfies TestRegistry) as RegistryGroups

    expect(result.components.map((item: { name: string }) => item.name)).toEqual([
      "button",
    ])
    expect(
      result.compositions.map((item: { name: string }) => item.name)
    ).toEqual(["empty-view"])
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
    }) as PromptChoice[]

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
