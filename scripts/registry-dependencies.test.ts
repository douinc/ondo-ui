import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

type RegistryItem = {
  name: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: Array<{ path: string }>
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

  // @shadcn/react is pre-1.0 and adds a new subpath export per release (e.g.
  // `./questionnaire` only exists from 0.3.0 onward). shadcn's installer only
  // force-upgrades a dependency when the registry item pins a version -- a
  // bare name is skipped whenever the package is already declared in the
  // consumer's package.json (shadcn/cli#10525). A registry item that imports
  // a @shadcn/react subpath but declares the dependency bare can leave a
  // project that already has an older @shadcn/react stuck on it, producing a
  // "Cannot find module '@shadcn/react/<subpath>'" error after install.
  test("pins a @shadcn/react version on every item that imports one of its subpaths", async () => {
    const registry = await readRegistry()
    const missingPins: string[] = []

    for (const item of registry.items) {
      let importsSubpath = false

      for (const file of item.files ?? []) {
        const source = await readFile(
          new URL(`../${file.path}`, import.meta.url),
          "utf8"
        ).catch(() => "")

        if (/from ["']@shadcn\/react\/[^"']+["']/.test(source)) {
          importsSubpath = true
          break
        }
      }

      if (!importsSubpath) continue

      const dependency = (item.dependencies ?? []).find(
        (dep) => dep === "@shadcn/react" || dep.startsWith("@shadcn/react@")
      )

      if (dependency === "@shadcn/react") {
        missingPins.push(item.name)
      }
    }

    expect(missingPins).toEqual([])
  })
})
