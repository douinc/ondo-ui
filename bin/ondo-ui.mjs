#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { readFile, readdir, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

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

export async function run(argv = process.argv.slice(2)) {
  const [command, ...args] = argv

  if (command !== "init") {
    throw new Error("Usage: ondo-ui init -t <next|vite|start|react-router|laravel|astro>")
  }

  const framework = getFramework(args)
  const child = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--yes", "shadcn@latest", ...buildShadcnArgs(args, framework)],
    {
      cwd: process.cwd(),
      env: getShadcnEnvironment(framework),
      stdio: "inherit",
    }
  )

  if (child.error) throw child.error
  if (child.status !== 0) process.exitCode = child.status ?? 1
  if (child.status !== 0) return child.status ?? 1

  const files = await configureOndoRegistry(args)
  console.log(`Ondo registry configured in ${files.length} components.json file(s).`)
  return 0
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : undefined
const currentPath = fileURLToPath(import.meta.url)

if (entryPath === currentPath) {
  run().catch((error) => {
    console.error(`ondo-ui: ${error.message}`)
    process.exitCode = 1
  })
}
