export {}

const baseUrl = process.argv[2]?.replace(/\/+$/, "")

if (!baseUrl) {
  throw new Error("Usage: bun run scripts/smoke-static-export.ts <base-url>")
}

const installationFrameworks = [
  "next",
  "vite",
  "tanstack",
  "laravel",
  "react-router",
  "astro",
  "manual",
] as const

const installationPaths = installationFrameworks.flatMap((framework) => [
  `/docs/installation/${framework}/`,
  `/ko/docs/installation/${framework}/`,
])

const paths = [
  "/",
  "/ko/",
  "/blocks/",
  "/ko/blocks/",
  "/blocks/ai/",
  "/blocks/workspace/",
  "/ko/blocks/ai/",
  "/ko/blocks/workspace/",
  "/view/agent-workspace-01/",
  "/docs/installation/",
  "/ko/docs/installation/",
  ...installationPaths,
  "/docs.md",
  "/docs/components/button.md",
  "/llm/en",
  "/llm/ko",
  "/api/search",
  "/r/registry.json",
  "/r/button.json",
  "/r/agent-workspace-01.json",
  "/r/styles/base-vega/agent-workspace-01-light.png",
  "/r/styles/base-vega/agent-workspace-01-dark.png",
] as const

const htmlPaths = new Set([
  "/",
  "/ko/",
  "/blocks/",
  "/ko/blocks/",
  "/blocks/ai/",
  "/blocks/workspace/",
  "/ko/blocks/ai/",
  "/ko/blocks/workspace/",
  "/view/agent-workspace-01/",
  "/docs/installation/",
  "/ko/docs/installation/",
  ...installationPaths,
])
const imagePaths = new Set([
  "/r/styles/base-vega/agent-workspace-01-light.png",
  "/r/styles/base-vega/agent-workspace-01-dark.png",
])
const expectedMarkdownTitles = new Map([
  ["/docs.md", "Introduction"],
  ["/docs/components/button.md", "Button"],
  ["/llm/en", "Introduction"],
  ["/llm/ko", "소개"],
])
const errors: string[] = []

for (const path of paths) {
  try {
    const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" })
    const body = imagePaths.has(path) ? "" : await response.text()

    if (!response.ok) {
      errors.push(`${path}: HTTP ${response.status}`)
      continue
    }

    if (htmlPaths.has(path) && !body.includes("<!DOCTYPE html")) {
      errors.push(`${path}: expected an HTML document`)
    }

    if (
      imagePaths.has(path) &&
      !response.headers.get("content-type")?.startsWith("image/png")
    ) {
      errors.push(`${path}: expected a PNG response`)
    }

    const expectedTitle = expectedMarkdownTitles.get(path)
    if (expectedTitle) {
      if (!body.trim() || !body.includes(expectedTitle)) {
        errors.push(`${path}: missing Markdown title "${expectedTitle}"`)
      }
      if (body.includes("<!DOCTYPE html")) {
        errors.push(`${path}: Markdown response contains an HTML wrapper`)
      }
    }

    if (path === "/api/search") {
      const search = JSON.parse(body) as {
        type?: unknown
        data?: Record<string, unknown>
      }
      if (search.type !== "i18n" || !search.data?.en || !search.data?.ko) {
        errors.push(`${path}: missing en/ko search index data`)
      }
    }

    if (path === "/r/registry.json") {
      const registry = JSON.parse(body) as {
        items?: Array<{ name?: unknown }>
      }
      if (!registry.items?.some((item) => item.name === "button")) {
        errors.push(`${path}: registry index does not contain button`)
      }
    }

    if (path === "/r/button.json") {
      const button = JSON.parse(body) as { name?: unknown }
      if (button.name !== "button") {
        errors.push(`${path}: registry payload name is not button`)
      }
    }

    if (path === "/r/agent-workspace-01.json") {
      const payload = JSON.parse(body) as {
        name?: unknown
        type?: unknown
        files?: Array<{ target?: unknown }>
      }

      if (payload.name !== "agent-workspace-01") {
        errors.push(`${path}: payload name is not agent-workspace-01`)
      }
      if (payload.type !== "registry:block") {
        errors.push(`${path}: payload type is not registry:block`)
      }
      if (
        !payload.files?.some(
          (file) => file.target === "app/agent-workspace/page.tsx"
        )
      ) {
        errors.push(`${path}: payload is missing its page target`)
      }
    }

    if (path === "/llm/en" || path === "/llm/ko") {
      const preview = body
        .slice(0, 80)
        .replace(/[\u0000-\u001f\u007f]+/g, " ")
        .trim()
      console.log(
        `PASS ${path} -> ${response.url} (${response.headers.get("content-type") ?? "unknown"}): ${preview}`
      )
    } else {
      console.log(`PASS ${path} -> ${response.url}`)
    }
  } catch (error) {
    errors.push(`${path}: ${String(error)}`)
  }
}

if (errors.length > 0) {
  console.error(
    `Static export smoke test failed with ${errors.length} error(s):`
  )
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Static export smoke test passed for ${paths.length} URLs.`)
}
