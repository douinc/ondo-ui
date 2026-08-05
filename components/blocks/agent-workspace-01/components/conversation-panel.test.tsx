import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { ConversationPanel } from "@/components/blocks/agent-workspace-01/components/conversation-panel"
import { ConversationRow } from "@/components/blocks/agent-workspace-01/components/conversation-row"
import {
  ReaderRailList,
  selectReaderAnchor,
} from "@/components/blocks/agent-workspace-01/components/reader-rail"
import { getWorkspaceEvents } from "@/components/blocks/agent-workspace-01/data"

describe("agent workspace conversation", () => {
  test("renders user messages with Message and muted Bubble", () => {
    const html = renderToStaticMarkup(
      <ConversationRow
        event={{
          id: "request-agent-workspace",
          availableAt: "running",
          kind: "message",
          role: "user",
          text: "Build an agent workspace.",
        }}
      />
    )

    expect(html).toContain('data-slot="message"')
    expect(html).toContain('data-align="end"')
    expect(html).toContain('data-slot="bubble"')
    expect(html).toContain('data-variant="muted"')
    expect(html).toContain("Build an agent workspace")
  })

  test("renders agent messages with Avatar and ghost Bubble", () => {
    const html = renderToStaticMarkup(
      <ConversationRow
        event={{
          id: "agent-plan",
          availableAt: "running",
          kind: "message",
          role: "agent",
          text: "I’ll inspect the repository.",
        }}
      />
    )

    expect(html).toContain('data-slot="avatar"')
    expect(html).toContain('data-variant="ghost"')
    expect(html).toContain("I’ll inspect the repository")
  })

  test("uses Marker and Attachment states for milestones and failures", () => {
    const markerHtml = renderToStaticMarkup(
      <ConversationRow
        event={{
          id: "milestone-complete",
          availableAt: "complete",
          kind: "marker",
          label: "Task complete",
          detail: "All checks passed",
          milestone: true,
          status: "success",
        }}
      />
    )
    const attachmentHtml = renderToStaticMarkup(
      <ConversationRow
        event={{
          id: "artifact-error",
          availableAt: "complete",
          kind: "attachment",
          fileName: "report.html",
          meta: "Could not generate",
          state: "error",
        }}
      />
    )

    expect(markerHtml).toContain('data-slot="marker"')
    expect(markerHtml).toContain('data-variant="separator"')
    expect(attachmentHtml).toContain('data-slot="attachment"')
    expect(attachmentHtml).toContain('data-state="error"')
    expect(attachmentHtml).toContain('aria-label="Retry report.html"')
    expect(attachmentHtml).toContain('aria-label="Remove report.html"')
  })

  test("renders tool activity as a keyboard-operable Collapsible", () => {
    const html = renderToStaticMarkup(
      <ConversationRow
        event={{
          id: "tool-inspect",
          availableAt: "running",
          kind: "tool",
          title: "Inspect repository",
          command: "rg --files",
          output: "Found source files.",
          status: "success",
        }}
      />
    )

    expect(html).toContain('data-slot="collapsible"')
    expect(html).toContain('data-slot="collapsible-trigger"')
    expect(html).toContain('data-slot="kbd"')
    expect(html).toContain('data-slot="badge"')
  })

  test("marks and selects the current Reader Rail destination", () => {
    const html = renderToStaticMarkup(
      <ReaderRailList
        items={[
          { id: "request-agent-workspace", label: "User request" },
          { id: "milestone-analyze", label: "Analyze request" },
        ]}
        currentAnchorId="milestone-analyze"
        onSelect={() => undefined}
      />
    )
    const calls: unknown[][] = []

    selectReaderAnchor((...args) => {
      calls.push(args)
      return true
    }, "milestone-analyze")

    expect(html).toContain('aria-current="location"')
    expect(html).toContain("Analyze request")
    expect(calls).toEqual([
      ["milestone-analyze", { align: "start", behavior: "smooth" }],
    ])
  })

  test("gives every complete transcript row its stable event id", () => {
    const html = renderToStaticMarkup(<ConversationPanel stage="complete" />)

    for (const event of getWorkspaceEvents("complete")) {
      expect(html).toContain(`data-message-id="${event.id}"`)
    }
  })
})
