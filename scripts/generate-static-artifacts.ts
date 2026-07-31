import { resolve } from "node:path"

import {
  buildArtifactFiles,
  writeArtifactFiles,
  type ArtifactLocale,
  type ArtifactPage,
} from "@/lib/static-artifacts"
import { source } from "@/lib/source"

const locales: ArtifactLocale[] = ["en", "ko"]
const pages: ArtifactPage[] = []

for (const locale of locales) {
  for (const page of source.getPages(locale)) {
    pages.push({
      locale,
      slugs: page.slugs,
      text: await page.data.getText("raw"),
    })
  }
}

const files = buildArtifactFiles(pages)

await writeArtifactFiles(files, {
  publicDir: resolve("public"),
  manifestPath: resolve(".generated/static-artifacts-manifest.json"),
})

console.log(`Generated ${files.length} static compatibility artifacts.`)
