import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { BlocksPage } from "@/app/_shared/pages/blocks-page"
import { TooltipProvider } from "@/components/ui/tooltip"

function renderPage(locale: "en" | "ko") {
  return renderToStaticMarkup(
    <TooltipProvider>
      <BlocksPage locale={locale} />
    </TooltipProvider>
  )
}

describe("BlocksPage", () => {
  test("renders the Agent Workspace instead of the English placeholder", () => {
    const html = renderPage("en")
    expect(html).toContain("Agent Workspace")
    expect(html).toContain(
      "bunx --bun shadcn@latest add @ondo-ui/agent-workspace"
    )
    expect(html).toContain('aria-label="Workspace state"')
    expect(html).toContain("Start")
    expect(html).toContain("Running")
    expect(html).toContain("Complete")
    expect(html).not.toContain("Coming soon")
  })

  test("localizes the Korean gallery chrome", () => {
    const html = renderPage("ko")
    expect(html).toContain("에이전트 워크스페이스")
    expect(html).toContain('aria-label="워크스페이스 상태"')
    expect(html).toContain("시작")
    expect(html).toContain("진행")
    expect(html).toContain("완료")
    expect(html).not.toContain("준비 중")
  })
})
