import { create } from "zbsearch"

export function createKoreanTokenizer() {
  return {
    language: "korean",
    normalizationCache: new Map<string, string>(),
    tokenize(raw: string) {
      return raw
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean)
    },
  }
}

export function createStaticSearchIndex(locale?: string) {
  if (locale === "ko") {
    return create({
      schema: { _: "string" },
      components: { tokenizer: createKoreanTokenizer() },
    })
  }

  return create({ schema: { _: "string" } })
}
