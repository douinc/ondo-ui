import { plugin } from "bun"
import { createMdxPlugin } from "fumadocs-mdx/bun"
import { readdir, readFile, stat } from "node:fs/promises"
import { relative, resolve, sep } from "node:path"

import {
  buildArtifactFiles,
  type ArtifactLocale,
  type ArtifactPage,
} from "@/lib/static-artifacts"
import {
  extractLocalReferences,
  resolvePublishedFile,
  validateRegistry,
} from "@/scripts/static-export-contract"

await plugin(createMdxPlugin())

const { source } = await import("@/lib/source")
const outDir = resolve("out")
const errors: string[] = []
const forbiddenPatterns = [
  /douinc\/ssh-deploy-action/i,
  /FORGE_DEPLOY_WEBHOOK/,
  /SSH_DOU_/,
  /HEALTH_CHECK_URL/,
  /https?:\/\/(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/i,
  /https?:\/\/[^"' \n]*(?:internal|corp|local)(?:[/:]|$)/i,
]

async function walkFiles(directory: string): Promise<string[]> {
  const files: string[] = []

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(path)))
    } else if (entry.isFile()) {
      files.push(path)
    }
  }

  return files
}

async function checkPublished(pathname: string): Promise<string | undefined> {
  try {
    return await resolvePublishedFile(outDir, pathname)
  } catch (error) {
    errors.push(`${pathname}: ${String(error)}`)
    return undefined
  }
}

const locales: ArtifactLocale[] = ["en", "ko"]
const artifactPages: ArtifactPage[] = []

for (const locale of locales) {
  for (const page of source.getPages(locale)) {
    artifactPages.push({
      locale,
      slugs: page.slugs,
      text: await page.data.getText("raw"),
    })
  }
}

const requiredPaths = new Set([
  "/",
  "/ko/",
  "/components/",
  "/ko/components/",
  "/blocks/",
  "/ko/blocks/",
])

for (const locale of locales) {
  for (const page of source.getPages(locale)) {
    requiredPaths.add(`${page.url.replace(/\/$/, "")}/`)
  }
}

for (const artifact of buildArtifactFiles(artifactPages)) {
  requiredPaths.add(`/${artifact.relativePath}`)
}

await Promise.all([...requiredPaths].map(checkPublished))

try {
  if (!(await stat(resolve(outDir, "_next"))).isDirectory()) {
    errors.push("out/_next is not a directory")
  }
} catch (error) {
  errors.push(`Missing out/_next directory: ${String(error)}`)
}

await checkPublished("/.nojekyll")

const searchPath = await checkPublished("/api/search")
if (searchPath) {
  try {
    const search = JSON.parse(await readFile(searchPath, "utf8")) as {
      type?: unknown
      data?: Record<string, unknown>
    }
    if (search.type !== "i18n") {
      errors.push(
        `Search export type must be "i18n", received ${JSON.stringify(search.type)}`
      )
    }
    if (!search.data?.en || !search.data?.ko) {
      errors.push("Search export must contain both en and ko locale data")
    }
  } catch (error) {
    errors.push(`Invalid search export at ${searchPath}: ${String(error)}`)
  }
}

errors.push(...(await validateRegistry(outDir)))

const files = await walkFiles(outDir)
const htmlFiles = files.filter((path) => {
  const displayPath = relative(outDir, path)
  return (
    path.endsWith(".html") &&
    displayPath !== "llm" &&
    !displayPath.startsWith(`llm${sep}`)
  )
})
const inspectableFiles = files.filter(
  (path) => path.endsWith(".html") || path.endsWith(".json")
)

for (const htmlPath of htmlFiles) {
  const html = await readFile(htmlPath, "utf8")
  const displayPath = relative(outDir, htmlPath)
  const isEnglishPage =
    displayPath !== "ko" &&
    !displayPath.startsWith(`ko${sep}`) &&
    !displayPath.startsWith(`llm${sep}`)

  for (const reference of extractLocalReferences(html)) {
    try {
      await resolvePublishedFile(outDir, reference)
    } catch (error) {
      errors.push(
        `${displayPath} references missing local path ${reference}: ${String(error)}`
      )
    }

    if (
      isEnglishPage &&
      (reference === "/en" || reference.startsWith("/en/"))
    ) {
      errors.push(
        `${displayPath} contains unintended English locale prefix: ${reference}`
      )
    }
  }
}

for (const path of inspectableFiles) {
  const contents = await readFile(path, "utf8")
  const displayPath = relative(outDir, path)

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(contents)) {
      errors.push(`${displayPath} contains forbidden deployment data: ${pattern}`)
    }
  }
}

if (errors.length > 0) {
  console.error(`Static export verification failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `Static export verified: ${requiredPaths.size} required paths, ${htmlFiles.length} HTML files, and ${files.length} total files.`
  )
}
