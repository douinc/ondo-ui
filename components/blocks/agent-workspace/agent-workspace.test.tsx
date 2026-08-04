import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { AgentWorkspace } from "@/components/blocks/agent-workspace/agent-workspace"
import { TooltipProvider } from "@/components/ui/tooltip"

function renderWorkspace(props: React.ComponentProps<typeof AgentWorkspace>) {
  return renderToStaticMarkup(
    <TooltipProvider>
      <AgentWorkspace {...props} />
    </TooltipProvider>
  )
}

describe("AgentWorkspace", () => {
  test("defaults to the start snapshot and accepts className", () => {
    const html = renderWorkspace({ className: "preview-height" })
    expect(html).toContain("무엇을 함께 개선할까요?")
    expect(html).toContain("preview-height")
    expect(html).toContain("min-h-svh")
  })

  test("controlled status wins over defaultStatus", () => {
    const html = renderWorkspace({
      defaultStatus: "start",
      status: "complete",
    })
    expect(html).toContain("온보딩 개선안을 완료했습니다")
  })

  test("renders labeled thread and complementary regions", () => {
    const html = renderWorkspace({ status: "running" })
    expect(html).toContain('aria-label="Agent task thread"')
    expect(html).toContain('aria-label="Task context"')
    expect(html).toContain('aria-label="Open task context"')
  })
})
