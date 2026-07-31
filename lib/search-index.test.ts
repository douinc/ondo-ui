import { describe, expect, test } from "bun:test"
import { insert, load, save, search, type AnyZBSearch } from "zbsearch"

import {
  createKoreanTokenizer,
  createStaticSearchIndex,
} from "@/lib/search-index"

function assertZBSearch(index: AnyZBSearch) {
  return index
}

describe("static search", () => {
  test("tokenizes Korean text and numbers across punctuation", () => {
    const tokenizer = createKoreanTokenizer()

    expect(tokenizer.tokenize("버튼, 입력 123!")).toEqual([
      "버튼",
      "입력",
      "123",
    ])
  })

  test("initializes locale-specific ZBSearch indexes", () => {
    expect(createStaticSearchIndex("en")).toBeDefined()
    expect(createStaticSearchIndex("ko")).toBeDefined()
  })

  test("restores and searches a Korean index", async () => {
    const source = assertZBSearch(createStaticSearchIndex("ko"))
    insert(source, { _: "온도 UI 버튼 입력" })

    const restored = assertZBSearch(createStaticSearchIndex("ko"))
    load(restored, save(source))

    const result = await search(restored, { term: "입력" })
    expect(result.hits).toHaveLength(1)
    expect(result.hits[0]?.document._).toContain("버튼")
  })
})
