#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises"
import { existsSync, realpathSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import {
  ONDO_REGISTRY_INDEX_URL,
  buildRegistryChoices,
  getSelectableRegistryItems,
  normalizeOndoItemAddress,
} from "./registry-menu.mjs"
import { runShadcn } from "./shadcn-process.mjs"

export const ONDO_REGISTRY_URL = "https://ui.ondo.dou.so/r/{name}.json"

const ITEM_URLS = {
  theme: "https://ui.ondo.dou.so/r/theme.json",
  "theme-provider": "https://ui.ondo.dou.so/r/theme-provider.json",
}

const FRAMEWORK_ITEMS = {
  next: ["theme", "theme-provider"],
  vite: ["theme", "theme-provider"],
  start: ["theme", "theme-provider"],
  "react-router": ["theme", "theme-provider"],
  laravel: ["theme", "theme-provider"],
  astro: ["theme"],
}

const SUPPORTED_FRAMEWORKS = Object.keys(FRAMEWORK_ITEMS)

export const PUBLIC_COMMANDS = [
  "init",
  "add",
  "search",
  "list",
  "view",
  "docs",
  "diff",
  "apply",
  "info",
  "migrate",
  "eject",
  "mcp",
  "preset",
  "build",
  "registry",
]

const ADD_VALUE_FLAGS = new Set(["-c", "--cwd", "-p", "--path", "--diff", "--view"])

export function parseCommand(argv = []) {
  const [command, ...args] = argv
  return { command, args }
}

export function parseAddArgs(args = []) {
  const components = []
  const forwardedArgs = []
  let all = false

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === "--all" || arg === "-a") {
      all = true
      continue
    }

    if (arg.startsWith("--all=")) {
      all = arg !== "--all=false"
      continue
    }

    if (arg.startsWith("-")) {
      forwardedArgs.push(arg)

      if (ADD_VALUE_FLAGS.has(arg) && args[index + 1] && !args[index + 1].startsWith("-")) {
        forwardedArgs.push(args[index + 1])
        index += 1
      }
      continue
    }

    components.push(arg)
  }

  return { components, args: forwardedArgs, all }
}

export function getSelectableNames(registry, mode = "all") {
  const { components, compositions } = getSelectableRegistryItems(registry)
  if (mode === "components") return components.map((item) => item.name)
  if (mode === "compositions") return compositions.map((item) => item.name)
  return [...components, ...compositions].map((item) => item.name)
}

async function fetchOndoRegistry() {
  const response = await fetch(ONDO_REGISTRY_INDEX_URL)
  if (!response.ok) {
    throw new Error(`Could not fetch the Ondo registry (${response.status})`)
  }

  const registry = await response.json()
  if (!Array.isArray(registry?.items)) {
    throw new Error("The Ondo registry returned an invalid registry index")
  }

  return registry
}

async function promptForOndoItems(registry) {
  const { default: prompts } = await import("prompts")
  return prompts({
    type: "multiselect",
    name: "items",
    message: "Which Ondo items would you like to add?",
    choices: buildRegistryChoices(registry),
    instructions: false,
    hint: "Space to select. Return to submit.",
  })
}

export async function runAdd(args = [], dependencies = {}) {
  const parsed = parseAddArgs(args)
  let components = parsed.components

  if (parsed.all || components.length === 0) {
    const registry = await (dependencies.fetchRegistry ?? fetchOndoRegistry)()

    if (parsed.all) {
      components = getSelectableNames(registry)
    } else {
      const result = await (dependencies.prompt ?? promptForOndoItems)(registry)
      components = result?.items ?? []
    }
  }

  if (components.length === 0) return 0

  const addresses = components.map(normalizeOndoItemAddress)
  return (dependencies.runShadcn ?? runShadcn)("add", [
    ...addresses,
    ...parsed.args,
  ])
}

export function getFrameworkItems(framework) {
  const items = FRAMEWORK_ITEMS[framework]

  if (!items) {
    throw new Error(
      `Unsupported framework "${framework}". Supported frameworks: ${SUPPORTED_FRAMEWORKS.join(", ")}`
    )
  }

  return [...items]
}

function getFlagValue(args, names) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    for (const name of names) {
      if (arg === name) return args[index + 1]
      if (arg.startsWith(`${name}=`)) return arg.slice(name.length + 1)
    }
  }

  return undefined
}

export function getFramework(args) {
  const framework = getFlagValue(args, ["-t", "--template"])

  if (framework) return framework
  if (args.includes("--defaults")) return "next"

  throw new Error(
    `A framework is required. Use --template with one of: ${SUPPORTED_FRAMEWORKS.join(", ")}`
  )
}

function hasFlag(args, flag) {
  return args.some((arg) => arg === flag || arg.startsWith(`${flag}=`))
}

function removeLaravelTemplate(args) {
  const result = []

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if ((arg === "-t" || arg === "--template") && args[index + 1] === "laravel") {
      index += 1
      continue
    }

    if (arg === "--template=laravel") continue
    result.push(arg)
  }

  return result
}

export function buildShadcnArgs(args, framework) {
  const frameworkArgs = framework === "laravel" ? removeLaravelTemplate(args) : [...args]
  const itemUrls = getFrameworkItems(framework).map((item) => ITEM_URLS[item])
  const result = ["init", ...frameworkArgs]

  if (!hasFlag(frameworkArgs, "--yes")) result.push("--yes")
  if (!hasFlag(frameworkArgs, "--monorepo") && !hasFlag(frameworkArgs, "--no-monorepo")) {
    result.push("--no-monorepo")
  }

  return [...result, ...itemUrls]
}

export function mergeOndoRegistry(config) {
  return {
    ...config,
    registries: {
      ...(config.registries ?? {}),
      "@ondo-ui": ONDO_REGISTRY_URL,
    },
  }
}

export function getShadcnEnvironment(framework, environment = process.env) {
  if (framework !== "laravel") return { ...environment }

  return {
    ...environment,
    npm_config_ignore_workspace_root_check: "true",
  }
}

function getCwd(args) {
  const cwd = getFlagValue(args, ["-c", "--cwd"])
  return resolve(cwd ?? process.cwd())
}

function getName(args) {
  return getFlagValue(args, ["-n", "--name"])
}

export function isDirectInvocation(entryPath, modulePath) {
  if (!entryPath) return false
  if (resolve(entryPath) === modulePath) return true

  try {
    return realpathSync(entryPath) === modulePath
  } catch {
    return false
  }
}

function getProjectRoots(args) {
  const cwd = getCwd(args)
  const name = getName(args)

  return name ? [resolve(cwd, name), cwd] : [cwd]
}

async function findComponentsFiles(root) {
  if (!existsSync(root)) return []

  const entries = await readdir(root, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue

    const path = join(root, entry.name)
    if (entry.isFile() && entry.name === "components.json") {
      files.push(path)
    } else if (entry.isDirectory()) {
      files.push(...(await findComponentsFiles(path)))
    }
  }

  return files
}

async function configureOndoRegistry(args) {
  const files = []

  for (const root of getProjectRoots(args)) {
    for (const file of await findComponentsFiles(root)) {
      if (!files.includes(file)) files.push(file)
    }
  }

  if (files.length === 0) {
    throw new Error(
      "shadcn initialization completed, but no components.json was found. Check the project path and try again."
    )
  }

  for (const file of files) {
    let config

    try {
      config = JSON.parse(await readFile(file, "utf8"))
    } catch (error) {
      throw new Error(`Could not parse ${file}: ${error.message}`)
    }

    await writeFile(file, `${JSON.stringify(mergeOndoRegistry(config), null, 2)}\n`, "utf8")
  }

  return files
}

function getUsage() {
  return `Usage: ondo-ui <${PUBLIC_COMMANDS.join("|")}> [options]`
}

export async function run(argv = process.argv.slice(2), dependencies = {}) {
  const { command, args } = parseCommand(argv)
  const delegate = dependencies.runShadcn ?? runShadcn

  if (command === "init") {
    const framework = getFramework(args)
    const childStatus = delegate(
      "init",
      buildShadcnArgs(args, framework).slice(1),
      {
        cwd: process.cwd(),
        env: getShadcnEnvironment(framework),
      }
    )

    if (childStatus !== 0) {
      process.exitCode = childStatus
      return childStatus
    }

    const files = await configureOndoRegistry(args)
    console.log(`Ondo registry configured in ${files.length} components.json file(s).`)
    return 0
  }

  if (command === "add") {
    return runAdd(args, { ...dependencies, runShadcn: delegate })
  }

  if (command === "list") {
    return delegate("search", args)
  }

  if (command === "diff") {
    const hasDiffFlag = args.some(
      (arg) => arg === "--diff" || arg.startsWith("--diff=")
    )
    return delegate("add", hasDiffFlag ? args : [...args, "--diff"])
  }

  if (PUBLIC_COMMANDS.includes(command)) {
    return delegate(command, args)
  }

  throw new Error(getUsage())
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : undefined
const currentPath = fileURLToPath(import.meta.url)

if (isDirectInvocation(entryPath, currentPath)) {
  run()
    .then((status) => {
      if (typeof status === "number" && status !== 0) process.exitCode = status
    })
    .catch((error) => {
      console.error(`ondo-ui: ${error.message}`)
      process.exitCode = 1
    })
}
