import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { workspaceSnapshots } from "@/components/blocks/agent-workspace/workspace-data"
import { WorkspaceThread } from "@/components/blocks/agent-workspace/workspace-thread"

function renderThread(status: "start" | "running" | "complete", draft = "") {
  const snapshot = workspaceSnapshots[status]
  return renderToStaticMarkup(
    <WorkspaceThread
      snapshot={snapshot}
      messages={snapshot.messages}
      draft={draft}
      onDraftChange={() => undefined}
      onSubmit={() => undefined}
    />
  )
}

describe("WorkspaceThread", () => {
  test("renders the start prompt and disables blank submission", () => {
    const html = renderThread("start")
    expect(html).toContain("무엇을 함께 개선할까요?")
    expect(html).toContain('disabled=""')
  })

  test("renders running plan semantics", () => {
    const html = renderThread("running", "수정 방향을 더 단순하게 해줘")
    expect(html).toContain('role="log"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain("작업 계획")
    expect(html).toContain("진행 중")
    expect(html).not.toContain('disabled=""')
  })

  test("renders completion evidence and metrics", () => {
    const html = renderThread("complete")
    expect(html).toContain("온보딩 개선안을 완료했습니다")
    expect(html).toContain("12/12")
    expect(html).toContain("검증 항목")
  })
})
