import { afterAll, describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

type ThemeItem = {
  name: string
  type: string
  cssVars?: {
    theme?: Record<string, string>
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  [key: string]: unknown
}

type Registry = {
  items: ThemeItem[]
}

const repoRoot = dirname(
  fileURLToPath(new URL("../package.json", import.meta.url))
)
const temporaryProjects: string[] = []

async function readThemeInputs() {
  const [globals, registryText] = await Promise.all([
    readFile(join(repoRoot, "app/globals.css"), "utf8"),
    readFile(join(repoRoot, "registry.json"), "utf8"),
  ])
  const registry = JSON.parse(registryText) as Registry
  const theme = registry.items.find((item) => item.name === "theme")

  if (!theme?.cssVars?.light || !theme.cssVars.dark) {
    throw new Error(
      "The theme registry item must define light and dark cssVars"
    )
  }

  return { globals, theme }
}

function extractVariables(css: string, selector: ":root" | ".dark") {
  const selectorStart = css.indexOf(`${selector} {`)
  if (selectorStart < 0) throw new Error(`Missing ${selector} theme block`)

  const blockStart = css.indexOf("{", selectorStart) + 1
  const blockEnd = css.indexOf("\n}", blockStart)
  if (blockEnd < 0) throw new Error(`Unclosed ${selector} theme block`)

  return new Map(
    [
      ...css
        .slice(blockStart, blockEnd)
        .matchAll(/^\s*--([\w-]+):\s*([^;]+);\s*(\/\*.*\*\/)?\s*$/gm),
    ].map(([, name, value, comment]) => [
      name,
      [value.trim(), comment?.trim()].filter(Boolean).join(" "),
    ])
  )
}

async function installThemeCss(theme: ThemeItem) {
  const project = await mkdtemp(join(tmpdir(), "ondo-theme-registry-"))
  temporaryProjects.push(project)
  const appDir = join(project, "app")
  await mkdir(appDir)

  const installItem = {
    ...theme,
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    dependencies: [],
    css: {},
  }
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch(request) {
      return new URL(request.url).pathname === "/theme.json"
        ? Response.json(installItem)
        : new Response("Not found", { status: 404 })
    },
  })

  try {
    await Promise.all([
      writeFile(
        join(project, "package.json"),
        JSON.stringify({
          private: true,
          dependencies: { react: "19.2.4", tailwindcss: "^4.3.3" },
        })
      ),
      writeFile(
        join(project, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "base-vega",
          rsc: true,
          tsx: true,
          tailwind: {
            config: "",
            css: "app/globals.css",
            baseColor: "zinc",
            cssVariables: true,
            prefix: "",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            ui: "@/components/ui",
            lib: "@/lib",
            hooks: "@/hooks",
          },
          registries: {
            "@test": `http://127.0.0.1:${server.port}/{name}.json`,
          },
        })
      ),
      writeFile(
        join(project, "tsconfig.json"),
        JSON.stringify({
          compilerOptions: {
            baseUrl: ".",
            paths: { "@/*": ["./*"] },
          },
        })
      ),
      writeFile(join(appDir, "globals.css"), '@import "tailwindcss";\n'),
    ])

    const child = Bun.spawn(
      [
        globalThis.process.execPath,
        join(repoRoot, "node_modules/shadcn/dist/index.js"),
        "add",
        "@test/theme",
        "--yes",
        "--overwrite",
        "--silent",
        "--cwd",
        project,
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
        env: { ...globalThis.process.env, CI: "1" },
      }
    )
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ])

    if (exitCode !== 0) {
      throw new Error(`shadcn add failed\n${stdout}\n${stderr}`)
    }

    return readFile(join(appDir, "globals.css"), "utf8")
  } finally {
    server.stop(true)
  }
}

afterAll(async () => {
  await Promise.all(
    temporaryProjects.map((project) =>
      rm(project, { recursive: true, force: true })
    )
  )
})

describe("theme registry", () => {
  test("matches every exported global variable including its comment", async () => {
    const { globals, theme } = await readThemeInputs()

    for (const [mode, selector] of [
      ["light", ":root"],
      ["dark", ".dark"],
    ] as const) {
      const declarations = extractVariables(globals, selector)

      for (const [name, value] of Object.entries(theme.cssVars?.[mode] ?? {})) {
        expect(value).toMatch(/\/\* .+ \*\/$/)
        expect(declarations.get(name)).toBe(value)
      }
    }
  })

  test("preserves registry comments in CSS installed by shadcn", async () => {
    const { theme } = await readThemeInputs()
    const css = await installThemeCss(theme)

    expect(css).toContain(
      "--primary: oklch(62.3% 0.214 259.815) /* blue-500 */;"
    )
    expect(css).toContain("--radius: 0.625rem /* Spacing-2.5 10px */;")
  }, 30_000)
})
