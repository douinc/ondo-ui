import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { AgentWorkspaceBlock } from "@/components/blocks/agent-workspace-01/page"

describe("AgentWorkspaceBlock", () => {
  test.each([
    ["start", "Repository ready"],
    ["running", "Run verification"],
    ["complete", "Task complete"],
  ] as const)("renders the %s lifecycle state", (stage, expectedText) => {
    const html = renderToStaticMarkup(
      <AgentWorkspaceBlock initialStage={stage} />
    )

    expect(html).toContain(`data-stage="${stage}"`)
    expect(html).toContain(expectedText)
    expect(html).toContain("OND-247")
    expect(html).toContain("initred/ondo-ui")
    expect(html).toContain("feature/agent-workspace-block")
  })

  test("defaults the interactive preview to running", () => {
    const html = renderToStaticMarkup(<AgentWorkspaceBlock />)
    expect(html).toContain('data-stage="running"')
  })

  test("composes the workspace from Ondo shell and progress primitives", () => {
    const html = renderToStaticMarkup(<AgentWorkspaceBlock />)

    for (const slot of [
      "sidebar-wrapper",
      "sidebar",
      "resizable-panel-group",
      "timeline",
      "progress",
      "progress-ring",
      "frame",
      "input-group",
    ]) {
      expect(html).toContain(`data-slot="${slot}"`)
    }
  })

  test("disables prompt submission only after completion", () => {
    const runningHtml = renderToStaticMarkup(
      <AgentWorkspaceBlock initialStage="running" />
    )
    const completeHtml = renderToStaticMarkup(
      <AgentWorkspaceBlock initialStage="complete" />
    )

    const runningButton = getOpeningTag(runningHtml, 'aria-label="Send prompt"')
    const completeButton = getOpeningTag(
      completeHtml,
      'aria-label="Send prompt"'
    )

    expect(runningButton).not.toContain(" disabled=")
    expect(completeButton).toContain(" disabled=")
  })
})

function getOpeningTag(html: string, marker: string) {
  const markerIndex = html.indexOf(marker)
  const start = html.lastIndexOf("<", markerIndex)
  const end = html.indexOf(">", markerIndex)

  return html.slice(start, end + 1)
}
