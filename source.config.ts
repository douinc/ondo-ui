import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"
import rehypePrettyCode from "rehype-pretty-code"

import { transformers } from "@/lib/highlight-code"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // Changelog entries carry the release they document. Two releases can land
    // on the same day, and the filename only encodes the date, so the version
    // is what orders them.
    schema: frontmatterSchema.extend({
      version: z.string().optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift()
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "vesper",
            light: "github-light-default",
          },
          transformers,
        },
      ])

      return plugins
    },
  },
})
