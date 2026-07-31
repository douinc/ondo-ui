import { describe, expect, test } from "bun:test"
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import {
  buildArtifactFiles,
  writeArtifactFiles,
} from "@/lib/static-artifacts"

const unsafeSlugCases: { slugs: string[] }[] = [
  { slugs: [".."] },
  { slugs: ["components", "..", "button"] },
  { slugs: ["/absolute"] },
  { slugs: ["components/button"] },
  { slugs: ["components\\button"] },
  { slugs: [""] },
]

describe("buildArtifactFiles", () => {
  test("maps English index and nested pages to public compatibility paths", () => {
    const files = buildArtifactFiles([
      { locale: "en", slugs: [], text: "# Docs" },
      {
        locale: "en",
        slugs: ["components", "button"],
        text: "# Button",
      },
    ])

    expect(files).toEqual([
      { relativePath: "docs.md", contents: "# Docs" },
      { relativePath: "en/docs.md", contents: "# Docs" },
      { relativePath: "llm/en/index.html", contents: "# Docs" },
      {
        relativePath: "docs/components/button.md",
        contents: "# Button",
      },
      {
        relativePath: "en/docs/components/button.md",
        contents: "# Button",
      },
      {
        relativePath: "llm/en/components/button/index.html",
        contents: "# Button",
      },
    ])
  })

  test("maps Korean pages only under /ko and /llm/ko", () => {
    const files = buildArtifactFiles([
      { locale: "ko", slugs: [], text: "# 문서" },
      { locale: "ko", slugs: ["installation"], text: "# 설치" },
    ])

    expect(files).toEqual([
      { relativePath: "ko/docs.md", contents: "# 문서" },
      { relativePath: "llm/ko/index.html", contents: "# 문서" },
      {
        relativePath: "ko/docs/installation.md",
        contents: "# 설치",
      },
      {
        relativePath: "llm/ko/installation/index.html",
        contents: "# 설치",
      },
    ])
  })

  test.each(unsafeSlugCases)("rejects unsafe slug segments: %j", ({ slugs }) => {
    expect(() =>
      buildArtifactFiles([{ locale: "en", slugs, text: "unsafe" }])
    ).toThrow("Unsafe slug segment")
  })

  test("rejects duplicate output paths", () => {
    const page = {
      locale: "en" as const,
      slugs: ["installation"],
      text: "# Install",
    }

    expect(() => buildArtifactFiles([page, page])).toThrow(
      "Duplicate artifact path"
    )
  })
})

describe("writeArtifactFiles", () => {
  test("removes only stale generated files and preserves unrelated public files", async () => {
    const root = await mkdtemp(join(tmpdir(), "ondo-artifacts-"))
    const publicDir = join(root, "public")
    const manifestPath = join(root, ".generated", "manifest.json")

    try {
      await mkdir(join(publicDir, "docs"), { recursive: true })
      await mkdir(join(root, ".generated"), { recursive: true })
      await writeFile(join(publicDir, "keep.txt"), "keep")
      await writeFile(join(publicDir, "docs", "removed.md"), "stale")
      await writeFile(manifestPath, JSON.stringify(["docs/removed.md"]))

      await writeArtifactFiles(
        [{ relativePath: "docs/current.md", contents: "current" }],
        { publicDir, manifestPath }
      )

      expect(await readFile(join(publicDir, "keep.txt"), "utf8")).toBe("keep")
      expect(
        await readFile(join(publicDir, "docs", "current.md"), "utf8")
      ).toBe("current")
      expect(
        await Bun.file(join(publicDir, "docs", "removed.md")).exists()
      ).toBe(false)
      expect(JSON.parse(await readFile(manifestPath, "utf8"))).toEqual([
        "docs/current.md",
      ])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test("rejects generated paths outside publicDir before writing", async () => {
    const root = await mkdtemp(join(tmpdir(), "ondo-artifacts-"))
    const publicDir = join(root, "public")
    const manifestPath = join(root, ".generated", "manifest.json")

    try {
      await expect(
        writeArtifactFiles(
          [{ relativePath: "../escaped.md", contents: "unsafe" }],
          { publicDir, manifestPath }
        )
      ).rejects.toThrow("Unsafe artifact path")
      expect(await Bun.file(join(root, "escaped.md")).exists()).toBe(false)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test("rejects malformed manifests before deleting files", async () => {
    const root = await mkdtemp(join(tmpdir(), "ondo-artifacts-"))
    const publicDir = join(root, "public")
    const manifestPath = join(root, ".generated", "manifest.json")

    try {
      await mkdir(join(root, ".generated"), { recursive: true })
      await writeFile(manifestPath, JSON.stringify([42]))

      await expect(
        writeArtifactFiles([], { publicDir, manifestPath })
      ).rejects.toThrow("Invalid artifact manifest")
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
