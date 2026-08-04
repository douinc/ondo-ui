import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { workspaceSnapshots } from "@/components/blocks/agent-workspace/workspace-data"
import { WorkspaceArtifacts } from "@/components/blocks/agent-workspace/workspace-artifacts"

function renderArtifacts(status: "start" | "running" | "complete") {
  const snapshot = workspaceSnapshots[status]
  return renderToStaticMarkup(
    <WorkspaceArtifacts
      snapshot={snapshot}
      selectedArtifactId={undefined}
      onArtifactSelect={() => undefined}
    />
  )
}

describe("WorkspaceArtifacts", () => {
  test("renders context files at start", () => {
    const html = renderArtifacts("start")
    expect(html).toContain('aria-label="Task context"')
    expect(html).toContain("onboarding-flow.fig")
  })

  test("renders progress and changed files while running", () => {
    const html = renderArtifacts("running")
    expect(html).toContain('aria-valuenow="64"')
    expect(html).toContain("onboarding-flow.tsx")
    expect(html).toContain("현재 작업")
  })

  test("renders completed deliverables", () => {
    const html = renderArtifacts("complete")
    expect(html).toContain("산출물")
    expect(html).toContain("implementation-plan.md")
    expect(html).toContain("모든 결과 검토")
  })

  test("renders an explicit empty artifact state", () => {
    const snapshot = {
      ...workspaceSnapshots.complete,
      deliverables: [],
    }
    const html = renderToStaticMarkup(
      <WorkspaceArtifacts
        snapshot={snapshot}
        selectedArtifactId={undefined}
        onArtifactSelect={() => undefined}
      />
    )
    expect(html).toContain("표시할 산출물이 없습니다")
  })
})
