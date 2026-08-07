import { describe, expect, test } from "bun:test"

import { buildInspectorScreenshotFilename } from "./screenshot"

describe("Design Inspector screenshot filenames", () => {
  const capturedAt = new Date("2026-08-07T03:04:05.678Z")

  test("names iframe captures with the page and viewport", () => {
    expect(
      buildInspectorScreenshotFilename(
        "/ko/docs/components/button?preview=1",
        "mobile",
        "iframe",
        capturedAt
      )
    ).toBe(
      "ondo-inspector-ko-docs-components-button-mobile-iframe-2026-08-07T03-04-05Z.png"
    )
  })

  test("distinguishes DesktopWindow captures and the home page", () => {
    expect(
      buildInspectorScreenshotFilename("/", "qhd", "desktop-window", capturedAt)
    ).toBe("ondo-inspector-home-qhd-desktop-window-2026-08-07T03-04-05Z.png")
  })

  test("keeps localized route names readable", () => {
    expect(
      buildInspectorScreenshotFilename(
        "/ko/컴포넌트/버튼",
        "tablet",
        "iframe",
        capturedAt
      )
    ).toBe(
      "ondo-inspector-ko-컴포넌트-버튼-tablet-iframe-2026-08-07T03-04-05Z.png"
    )
  })
})
