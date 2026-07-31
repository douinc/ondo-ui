import { createFromSource } from "fumadocs-core/search/server"

import { createKoreanTokenizer } from "@/lib/search-index"
import { source } from "@/lib/source"

export const dynamic = "force-static"

const search = createFromSource(source, {
  localeMap: {
    ko: { tokenizer: createKoreanTokenizer() },
  },
})

export const GET = search.staticGET
