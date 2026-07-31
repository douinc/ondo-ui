import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import { dirname, isAbsolute, relative, resolve, sep } from "node:path"

export type ArtifactLocale = "en" | "ko"

export type ArtifactPage = {
  locale: ArtifactLocale
  slugs: string[]
  text: string
}

export type ArtifactFile = {
  relativePath: string
  contents: string
}

export type WriteArtifactOptions = {
  publicDir: string
  manifestPath: string
}

function assertSafeSlugSegment(segment: string): void {
  if (
    segment.length === 0 ||
    segment === "." ||
    segment === ".." ||
    segment.includes("/") ||
    segment.includes("\\") ||
    segment.startsWith("/")
  ) {
    throw new Error(`Unsafe slug segment: ${JSON.stringify(segment)}`)
  }
}

function pathsForPage(page: ArtifactPage): string[] {
  page.slugs.forEach(assertSafeSlugSegment)
  const suffix = page.slugs.join("/")
  const llmPath = suffix
    ? `llm/${page.locale}/${suffix}/index.html`
    : `llm/${page.locale}/index.html`

  if (page.locale === "en") {
    return suffix
      ? [`docs/${suffix}.md`, `en/docs/${suffix}.md`, llmPath]
      : ["docs.md", "en/docs.md", llmPath]
  }

  return suffix
    ? [`ko/docs/${suffix}.md`, llmPath]
    : ["ko/docs.md", llmPath]
}

export function buildArtifactFiles(pages: ArtifactPage[]): ArtifactFile[] {
  const seen = new Set<string>()
  const files: ArtifactFile[] = []

  for (const page of pages) {
    for (const relativePath of pathsForPage(page)) {
      if (seen.has(relativePath)) {
        throw new Error(`Duplicate artifact path: ${relativePath}`)
      }
      seen.add(relativePath)
      files.push({ relativePath, contents: page.text })
    }
  }

  return files
}

function resolveInside(root: string, relativePath: string): string {
  if (relativePath.length === 0 || isAbsolute(relativePath)) {
    throw new Error(`Unsafe artifact path: ${JSON.stringify(relativePath)}`)
  }

  const resolvedRoot = resolve(root)
  const target = resolve(resolvedRoot, relativePath)
  const fromRoot = relative(resolvedRoot, target)

  if (
    fromRoot === ".." ||
    fromRoot.startsWith(`..${sep}`) ||
    isAbsolute(fromRoot)
  ) {
    throw new Error(`Unsafe artifact path: ${JSON.stringify(relativePath)}`)
  }

  return target
}

async function readManifest(manifestPath: string): Promise<string[]> {
  let raw: string

  try {
    raw = await readFile(manifestPath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
    throw error
  }

  const parsed: unknown = JSON.parse(raw)
  if (
    !Array.isArray(parsed) ||
    !parsed.every((item): item is string => typeof item === "string")
  ) {
    throw new Error(`Invalid artifact manifest: ${manifestPath}`)
  }

  return parsed
}

export async function writeArtifactFiles(
  files: ArtifactFile[],
  { publicDir, manifestPath }: WriteArtifactOptions
): Promise<void> {
  const previousPaths = await readManifest(manifestPath)
  const nextPaths = files.map((file) => file.relativePath)
  const allPaths = [...previousPaths, ...nextPaths]

  for (const relativePath of allPaths) {
    resolveInside(publicDir, relativePath)
  }

  for (const relativePath of previousPaths) {
    await rm(resolveInside(publicDir, relativePath), { force: true })
  }

  for (const file of files) {
    const target = resolveInside(publicDir, file.relativePath)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, file.contents)
  }

  await mkdir(dirname(manifestPath), { recursive: true })
  await writeFile(
    manifestPath,
    `${JSON.stringify([...nextPaths].sort(), null, 2)}\n`
  )
}
