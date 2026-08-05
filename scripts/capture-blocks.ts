import { access, mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import puppeteer from "puppeteer"

import registry from "@/registry.json"

import { getBlockNameStaticParams } from "@/lib/blocks"

const args = process.argv.slice(2)
const force = args.includes("--force")
const baseUrl =
  args.find((argument) => !argument.startsWith("--"))?.replace(/\/+$/, "") ??
  "http://localhost:3000"
const screenshotDir = resolve("public/r/styles/base-vega")
const themes = ["light", "dark"] as const
const errors: string[] = []

await mkdir(screenshotDir, { recursive: true })

const browser = await puppeteer.launch({
  defaultViewport: {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  },
  headless: true,
})

try {
  for (const { name } of getBlockNameStaticParams(registry.items)) {
    for (const theme of themes) {
      const screenshotPath = resolve(screenshotDir, `${name}-${theme}.png`)

      if (!force && (await fileExists(screenshotPath))) {
        console.log(`SKIP ${name} (${theme}): ${screenshotPath}`)
        continue
      }

      const page = await browser.newPage()

      try {
        await page.evaluateOnNewDocument((selectedTheme) => {
          localStorage.setItem("theme", selectedTheme)
        }, theme)
        await page.emulateMediaFeatures([
          {
            name: "prefers-color-scheme",
            value: theme,
          },
        ])
        await page.goto(`${baseUrl}/view/${name}/`, {
          waitUntil: "networkidle0",
        })
        await page.evaluate(async () => {
          await document.fonts.ready
          await new Promise<void>((ready) => {
            requestAnimationFrame(() => requestAnimationFrame(() => ready()))
          })
        })
        await page.screenshot({
          path: screenshotPath,
          fullPage: false,
        })

        console.log(`CAPTURE ${name} (${theme}): ${screenshotPath}`)
      } catch (error) {
        errors.push(`${name} (${theme}): ${String(error)}`)
      } finally {
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
}

if (errors.length > 0) {
  console.error(`Block capture failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
}

async function fileExists(path: string) {
  try {
    await access(path)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false
    throw error
  }
}
