import { describe, expect, test } from "bun:test"

import { getDocsStaticParams } from "@/app/_shared/docs/route-helpers"

describe("getDocsStaticParams", () => {
  test.each(["en", "ko"] as const)(
    "returns index and nested slugs for %s documentation",
    (locale) => {
      const params = getDocsStaticParams(locale)

      expect(params).toContainEqual({ slug: [] })
      expect(params).toContainEqual({
        slug: ["components", "button"],
      })
      expect(new Set(params.map((item) => item.slug.join("/"))).size).toBe(
        params.length
      )
    }
  )
})
