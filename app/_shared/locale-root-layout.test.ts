import { describe, expect, test } from "bun:test"

import { getRootMetadata } from "@/app/_shared/locale-root-layout"

describe("getRootMetadata", () => {
  test("returns locale-specific root metadata without dynamic route params", () => {
    expect(getRootMetadata("en")).toMatchObject({
      title: {
        default: "ondo/ui",
        template: "%s - ondo/ui",
      },
      description:
        "An open-source design system built to feel warm and trustworthy\n— for every generation, on desktop and mobile.",
      appleWebApp: {
        title: "Ondo UI",
      },
    })

    expect(getRootMetadata("ko")).toMatchObject({
      description:
        "따뜻하고 신뢰감 있는 오픈소스 디자인 시스템\n— 모든 세대를 위해, 데스크탑과 모바일 모두에서.",
    })
  })
})
