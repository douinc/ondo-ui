import { describe, expect, test } from "bun:test"

import {
  createKoreanTokenizer,
  createStaticSearchIndex,
} from "@/lib/search-index"

describe("static search", () => {
  test("tokenizes Korean text and numbers across punctuation", () => {
    const tokenizer = createKoreanTokenizer()

    expect(tokenizer.tokenize("버튼, 입력 123!")).toEqual([
      "버튼",
      "입력",
      "123",
    ])
  })

  test("initializes locale-specific Orama indexes", () => {
    expect(createStaticSearchIndex("en")).toBeDefined()
    expect(createStaticSearchIndex("ko")).toBeDefined()
  })
})
