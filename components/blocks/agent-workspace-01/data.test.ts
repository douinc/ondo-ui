import { describe, expect, test } from "bun:test"

import {
  getAttachmentStateLabel,
  getReaderRailItems,
  getWorkspaceEvents,
  isReaderAnchor,
  workspaceEvents,
} from "@/components/blocks/agent-workspace-01/data"

describe("agent workspace fixture", () => {
  test("uses one ordered fixture for all lifecycle stages", () => {
    const start = getWorkspaceEvents("start")
    const running = getWorkspaceEvents("running")
    const complete = getWorkspaceEvents("complete")

    expect(running.slice(0, start.length)).toEqual(start)
    expect(complete.slice(0, running.length)).toEqual(running)
    expect(complete).toEqual([...workspaceEvents])
  })

  test("anchors only user turns and milestone markers", () => {
    const anchors = workspaceEvents.filter(isReaderAnchor)

    expect(anchors.map((event) => event.id)).toEqual([
      "request-agent-workspace",
      "milestone-analyze",
      "milestone-edit",
      "milestone-verify",
      "milestone-complete",
    ])
    expect(anchors.every((event) => event.kind !== "tool")).toBe(true)
    expect(anchors.every((event) => event.kind !== "attachment")).toBe(true)
  })

  test("derives Reader Rail labels from visible anchors", () => {
    expect(getReaderRailItems(getWorkspaceEvents("complete"))).toEqual([
      { id: "request-agent-workspace", label: "User request" },
      { id: "milestone-analyze", label: "Analyze request" },
      { id: "milestone-edit", label: "Edit files" },
      { id: "milestone-verify", label: "Run verification" },
      { id: "milestone-complete", label: "Task complete" },
    ])
  })

  test("contains processing, done, and error attachment examples", () => {
    const states = workspaceEvents
      .filter((event) => event.kind === "attachment")
      .map((event) => event.state)

    expect(states).toEqual(
      expect.arrayContaining(["processing", "done", "error"])
    )
  })

  test("provides distinct ids and readable attachment state labels", () => {
    const ids = workspaceEvents.map((event) => event.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(getAttachmentStateLabel("processing")).toBe("Processing")
    expect(getAttachmentStateLabel("done")).toBe("Ready")
    expect(getAttachmentStateLabel("error")).toBe("Needs attention")
  })
})
