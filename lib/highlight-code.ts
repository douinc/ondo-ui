import { codeToHtml } from "shiki"
import type { ShikiTransformer } from "shiki"

export const transformers = [
  {
    code(node) {
      if (node.tagName === "code") {
        const raw = this.source
        node.properties["__raw__"] = raw

        if (raw.startsWith("npm install")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm install", "yarn add")
          node.properties["__pnpm__"] = raw.replace("npm install", "pnpm add")
          node.properties["__bun__"] = raw.replace("npm install", "bun add")
        } else if (raw.startsWith("npx create-")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace(
            "npx create-",
            "yarn create "
          )
          node.properties["__pnpm__"] = raw.replace(
            "npx create-",
            "pnpm create "
          )
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        } else if (raw.startsWith("npm create")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm create", "yarn create")
          node.properties["__pnpm__"] = raw.replace("npm create", "pnpm create")
          node.properties["__bun__"] = raw.replace("npm create", "bun create")
        } else if (raw.startsWith("npx")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npx", "yarn dlx")
          node.properties["__pnpm__"] = raw.replace("npx", "pnpm dlx")
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        } else if (raw.startsWith("npm run")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm run", "yarn")
          node.properties["__pnpm__"] = raw.replace("npm run", "pnpm")
          node.properties["__bun__"] = raw.replace("npm run", "bun")
        } else if (raw.startsWith("bunx --bun shadcn")) {
          // ondo docs are written with bunx examples; normalize those too.
          node.properties["__npm__"] = raw.replace("bunx --bun", "npx")
          node.properties["__yarn__"] = raw.replace("bunx --bun", "yarn dlx")
          node.properties["__pnpm__"] = raw.replace("bunx --bun", "pnpm dlx")
          node.properties["__bun__"] = raw
        } else if (raw.startsWith("bunx shadcn")) {
          node.properties["__npm__"] = raw.replace("bunx", "npx")
          node.properties["__yarn__"] = raw.replace("bunx", "yarn dlx")
          node.properties["__pnpm__"] = raw.replace("bunx", "pnpm dlx")
          node.properties["__bun__"] = raw.replace("bunx", "bunx --bun")
        }
      }
    },
  },
] as ShikiTransformer[]

// Highlighting is deterministic and the demo set is finite, so a plain
// module-level cache is enough to dedupe work across pages and locales.
const highlightCache = new Map<string, string>()

export async function highlightCode(code: string, language: string = "tsx") {
  const cacheKey = `${language}:${code}`

  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const html = await codeToHtml(code, {
    lang: language,
    // Keep in sync with the rehype-pretty-code themes in source.config.ts.
    themes: {
      dark: "vesper",
      light: "github-light-default",
    },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          node.properties["class"] =
            "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-data-line-numbers:px-0 bg-transparent!"
        },
        code(node) {
          node.properties["data-line-numbers"] = ""
        },
        line(node) {
          node.properties["data-line"] = ""
        },
      },
    ],
  })

  highlightCache.set(cacheKey, html)

  return html
}
