import { afterEach, describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import {
  extractLocalReferences,
  resolvePublishedFile,
  validateRegistry,
} from "@/scripts/static-export-contract"

const roots: string[] = []

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
  )
})

async function createOutDir() {
  const root = await mkdtemp(join(tmpdir(), "ondo-export-"))
  roots.push(root)
  const outDir = join(root, "out")

  await mkdir(join(outDir, "docs", "installation"), { recursive: true })
  await writeFile(join(outDir, "docs.md"), "# Docs")
  await writeFile(
    join(outDir, "docs", "installation", "index.html"),
    "<!DOCTYPE html>"
  )

  return outDir
}

async function writeRegistryFile(
  outDir: string,
  relativePath: string,
  value: unknown
) {
  const path = join(outDir, "r", relativePath)
  await mkdir(join(outDir, "r"), { recursive: true })
  await writeFile(path, JSON.stringify(value))
}

describe("static export contract", () => {
  test("resolves extension files and directory index pages", async () => {
    const outDir = await createOutDir()

    expect(
      (await resolvePublishedFile(outDir, "/docs.md")).endsWith("/docs.md")
    ).toBe(true)
    expect(
      (
        await resolvePublishedFile(outDir, "/docs/installation/")
      ).endsWith("/docs/installation/index.html")
    ).toBe(true)
  })

  test("extracts only local href and src paths without query or hash", () => {
    expect(
      extractLocalReferences(
        '<a href="/docs/button/?x=1#api"></a><img src="/_next/a.js"><a href="https://github.com"></a>'
      )
    ).toEqual(["/docs/button/", "/_next/a.js"])
  })

  test.each(["/../secret", "/%2e%2e/secret", "/docs\\secret"])(
    "rejects unsafe published paths: %s",
    async (pathname) => {
      const outDir = await createOutDir()

      await expect(resolvePublishedFile(outDir, pathname)).rejects.toThrow(
        "Unsafe published path"
      )
    }
  )
})

describe("validateRegistry", () => {
  test("accepts matching payloads and skips external registry dependencies", async () => {
    const outDir = await createOutDir()
    await writeRegistryFile(outDir, "registry.json", {
      items: [{ name: "utils" }, { name: "button" }],
    })
    await writeRegistryFile(outDir, "utils.json", {
      name: "utils",
      registryDependencies: [],
    })
    await writeRegistryFile(outDir, "button.json", {
      name: "button",
      registryDependencies: [
        "utils",
        "https://example.com/r/external.json",
      ],
    })

    expect(await validateRegistry(outDir)).toEqual([])
  })

  test("reports duplicate items, payload mismatches, and missing local dependencies", async () => {
    const outDir = await createOutDir()
    await writeRegistryFile(outDir, "registry.json", {
      items: [
        { name: "button" },
        { name: "button" },
        { name: "card" },
      ],
    })
    await writeRegistryFile(outDir, "button.json", {
      name: "wrong-name",
      registryDependencies: ["utils"],
    })

    expect(await validateRegistry(outDir)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Duplicate registry item "button"'),
        expect.stringContaining('payload name "wrong-name"'),
        expect.stringContaining('dependency "utils"'),
        expect.stringContaining('Missing registry payload for "card"'),
      ])
    )
  })
})
