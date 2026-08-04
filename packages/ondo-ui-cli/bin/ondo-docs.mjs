import { ONDO_REGISTRY_INDEX_URL } from "./registry-menu.mjs"
import { runShadcn } from "./shadcn-process.mjs"

export { ONDO_REGISTRY_INDEX_URL }

export const ONDO_DOCS_BASE_URL = "https://ui.ondo.dou.so/docs"
export const ONDO_REGISTRY_ITEM_BASE_URL = "https://ui.ondo.dou.so/r"

export function classifyDocsAddress(address) {
  if (address.startsWith("@ondo-ui/")) {
    return { kind: "ondo", name: address.slice("@ondo-ui/".length) }
  }

  if (
    address.startsWith("@") ||
    address.startsWith("http://") ||
    address.startsWith("https://") ||
    address.startsWith("./") ||
    address.startsWith("../") ||
    address.includes("/") ||
    address.endsWith(".json")
  ) {
    return { kind: "external", address }
  }

  return { kind: "ondo", name: address }
}

function hasCompositionPath(item) {
  return (
    Array.isArray(item?.files) &&
    item.files.some(
      (file) =>
        typeof file?.path === "string" &&
        file.path
          .replaceAll("\\", "/")
          .startsWith("components/compositions/")
    )
  )
}

export function classifyOndoDocsItem(item) {
  if (item?.type === "registry:ui") return "component"
  if (hasCompositionPath(item)) return "composition"
  if (item?.name === "theme" || item?.name === "theme-provider") {
    return "theming"
  }
  return "registry"
}

function getDocsUrl(item, category) {
  if (category === "component") {
    return `${ONDO_DOCS_BASE_URL}/components/${item.name}`
  }
  if (category === "composition") {
    return `${ONDO_DOCS_BASE_URL}/compositions/${item.name}`
  }
  if (category === "theming") return `${ONDO_DOCS_BASE_URL}/theming`
  return undefined
}

export function buildOndoDocsResult(item) {
  const category = classifyOndoDocsItem(item)
  const docsUrl = getDocsUrl(item, category)

  return {
    component: item.name,
    category,
    links: {
      ...(docsUrl ? { docs: docsUrl } : {}),
      registry: `${ONDO_REGISTRY_ITEM_BASE_URL}/${item.name}.json`,
    },
  }
}

const DOCS_VALUE_FLAGS = new Set(["-c", "--cwd", "-b", "--base"])

export function parseOndoDocsArgs(args = []) {
  const items = []
  let json = false

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === "--json") {
      json = true
      continue
    }

    if (DOCS_VALUE_FLAGS.has(arg)) {
      if (args[index + 1] !== undefined) index += 1
      continue
    }

    if (arg.startsWith("-")) continue
    items.push(arg)
  }

  if (items.length === 0) {
    throw new Error("At least one documentation item is required")
  }

  return {
    items,
    json,
    forwardedArgs: [...args],
  }
}

async function fetchOndoRegistry() {
  const response = await fetch(ONDO_REGISTRY_INDEX_URL)
  if (!response.ok) {
    throw new Error(`Could not fetch the Ondo registry (${response.status})`)
  }
  return response.json()
}

function validateRegistry(registry) {
  if (!Array.isArray(registry?.items)) {
    throw new Error("The Ondo registry returned an invalid registry index")
  }
  return registry
}

function printTextResults(results, log, warn) {
  for (const result of results) {
    log(result.component)
    if (result.links.docs) {
      log(`  docs:     ${result.links.docs}`)
    } else {
      warn(
        `Ondo registry item "${result.component}" does not have a dedicated docs page.`
      )
    }
    log(`  registry: ${result.links.registry}`)
  }
}

export async function runOndoDocs(args = [], dependencies = {}) {
  const parsed = parseOndoDocsArgs(args)
  const addresses = parsed.items.map(classifyDocsAddress)
  const hasOndo = addresses.some((address) => address.kind === "ondo")
  const hasExternal = addresses.some((address) => address.kind === "external")

  if (hasOndo && hasExternal) {
    throw new Error(
      "Run Ondo and external documentation requests separately"
    )
  }

  if (hasExternal) {
    return (dependencies.runShadcn ?? runShadcn)(
      "docs",
      parsed.forwardedArgs
    )
  }

  const registry = validateRegistry(
    await (dependencies.fetchRegistry ?? fetchOndoRegistry)()
  )
  const results = addresses.map(({ name }) => {
    const item = registry.items.find((candidate) => candidate?.name === name)
    if (!item) {
      throw new Error(`Ondo registry item "${name}" was not found.`)
    }
    return buildOndoDocsResult(item)
  })

  const log = dependencies.log ?? console.log
  const payload = {
    registry: "@ondo-ui",
    base: "base",
    results,
  }

  if (parsed.json) {
    log(JSON.stringify(payload, null, 2))
  } else {
    printTextResults(results, log, dependencies.warn ?? console.warn)
  }

  return 0
}
