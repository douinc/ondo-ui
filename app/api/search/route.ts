import { createFromSource } from "fumadocs-core/search/server"

import { createKoreanTokenizer } from "@/lib/search-index"
import { source } from "@/lib/source"

export const dynamic = "force-static"

const search = createFromSource(source, {
  localeMap: {
    // ZBSearch rejects a custom tokenizer when a language is provided.
    // Keep the Fumadocs legacy locale map from injecting its multilingual default.
    ko: { language: "", tokenizer: createKoreanTokenizer() },
  },
})

export const GET = search.staticGET
