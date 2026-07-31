import { readFile, stat } from "node:fs/promises"
import { isAbsolute, relative, resolve, sep } from "node:path"

function resolveInside(root: string, pathname: string): string {
  let decoded: string

  try {
    decoded = decodeURIComponent(pathname.split(/[?#]/, 1)[0])
  } catch {
    throw new Error(`Unsafe published path: ${JSON.stringify(pathname)}`)
  }

  if (
    !decoded.startsWith("/") ||
    decoded.includes("\\") ||
    decoded.includes("\0") ||
    decoded.split("/").some((segment) => segment === "..")
  ) {
    throw new Error(`Unsafe published path: ${JSON.stringify(pathname)}`)
  }

  const resolvedRoot = resolve(root)
  const target = resolve(resolvedRoot, decoded.replace(/^\/+/, ""))
  const fromRoot = relative(resolvedRoot, target)

  if (
    fromRoot === ".." ||
    fromRoot.startsWith(`..${sep}`) ||
    isAbsolute(fromRoot)
  ) {
    throw new Error(`Unsafe published path: ${JSON.stringify(pathname)}`)
  }

  return target
}

async function isFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false
    throw error
  }
}

export async function resolvePublishedFile(
  outDir: string,
  pathname: string
): Promise<string> {
  const direct = resolveInside(outDir, pathname)
  const candidates = [direct, resolve(direct, "index.html"), `${direct}.html`]

  for (const candidate of candidates) {
    if (await isFile(candidate)) return candidate
  }

  throw new Error(`Missing published path: ${pathname}`)
}

export function extractLocalReferences(html: string): string[] {
  const references: string[] = []
  const attributePattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi

  for (const match of html.matchAll(attributePattern)) {
    const value = match[2]
    if (!value.startsWith("/") || value.startsWith("//")) continue

    const pathname = value.split(/[?#]/, 1)[0]
    if (pathname) references.push(pathname)
  }

  return references
}

type RegistryIndex = {
  items?: Array<{ name?: unknown }>
}

type RegistryPayload = {
  name?: unknown
  registryDependencies?: unknown
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"))
}

export async function validateRegistry(outDir: string): Promise<string[]> {
  const errors: string[] = []
  const registryPath = resolve(outDir, "r", "registry.json")
  let registry: RegistryIndex

  try {
    registry = (await readJson(registryPath)) as RegistryIndex
  } catch (error) {
    return [`Invalid registry index at ${registryPath}: ${String(error)}`]
  }

  if (!Array.isArray(registry.items)) {
    return [`Registry index has no items array: ${registryPath}`]
  }

  const names = new Set<string>()
  const payloadPaths = new Map<string, string>()

  for (const item of registry.items) {
    if (typeof item?.name !== "string") {
      errors.push("Registry index contains an item without a string name")
      continue
    }

    const name = item.name
    if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
      errors.push(`Unsafe registry item name "${name}"`)
      continue
    }
    if (names.has(name)) {
      errors.push(`Duplicate registry item "${name}"`)
      continue
    }

    names.add(name)
    payloadPaths.set(name, resolve(outDir, "r", `${name}.json`))
  }

  for (const name of names) {
    const payloadPath = payloadPaths.get(name)!
    let payload: RegistryPayload

    try {
      payload = (await readJson(payloadPath)) as RegistryPayload
    } catch (error) {
      errors.push(`Missing registry payload for "${name}": ${String(error)}`)
      continue
    }

    if (payload.name !== name) {
      errors.push(
        `Registry item "${name}" has payload name ${JSON.stringify(payload.name)}`
      )
    }

    const dependencies = payload.registryDependencies
    if (dependencies === undefined) continue
    if (
      !Array.isArray(dependencies) ||
      !dependencies.every((dependency) => typeof dependency === "string")
    ) {
      errors.push(
        `Registry item "${name}" has invalid registryDependencies`
      )
      continue
    }

    for (const dependency of dependencies) {
      if (dependency.startsWith("https://")) continue

      if (!names.has(dependency)) {
        errors.push(
          `Registry item "${name}" references missing dependency "${dependency}"`
        )
        continue
      }

      const dependencyPath = payloadPaths.get(dependency)!
      if (!(await isFile(dependencyPath))) {
        errors.push(
          `Registry item "${name}" dependency "${dependency}" has no payload`
        )
      }
    }
  }

  return errors
}
