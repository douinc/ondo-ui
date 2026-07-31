export {}

const baseUrl = process.argv[2]?.replace(/\/+$/, "")

if (!baseUrl) {
  throw new Error(
    "Usage: bun run scripts/smoke-static-export.ts <base-url>"
  )
}

const paths = [
  "/",
  "/ko/",
  "/docs/installation/",
  "/ko/docs/installation/",
  "/docs.md",
  "/docs/components/button.md",
  "/llm/en",
  "/llm/ko",
  "/api/search",
  "/r/registry.json",
  "/r/button.json",
] as const

const htmlPaths = new Set([
  "/",
  "/ko/",
  "/docs/installation/",
  "/ko/docs/installation/",
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
    const body = await response.text()

    if (!response.ok) {
      errors.push(`${path}: HTTP ${response.status}`)
      continue
    }

    if (htmlPaths.has(path) && !body.includes("<!DOCTYPE html")) {
      errors.push(`${path}: expected an HTML document`)
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
  console.error(`Static export smoke test failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Static export smoke test passed for ${paths.length} URLs.`)
}
