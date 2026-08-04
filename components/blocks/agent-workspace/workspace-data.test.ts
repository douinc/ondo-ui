import { describe, expect, test } from "bun:test"

import {
  getVisibleArtifacts,
  selectWorkspaceItem,
  workspaceSnapshots,
} from "@/components/blocks/agent-workspace/workspace-data"

describe("agent workspace fixtures", () => {
  test("defines all lifecycle snapshots for one stable task", () => {
    expect(Object.keys(workspaceSnapshots)).toEqual([
      "start",
      "running",
      "complete",
    ])
    expect(
      Object.values(workspaceSnapshots).map(
        (snapshot) => snapshot.selectedTaskId
      )
    ).toEqual([
      "onboarding-improvement",
      "onboarding-improvement",
      "onboarding-improvement",
    ])
    expect(workspaceSnapshots.running.progress).toBe(64)
    expect(workspaceSnapshots.complete.completion?.verification).toBe("12/12")
  })

  test("selects a requested item and safely falls back", () => {
    const tasks = workspaceSnapshots.running.tasks

    expect(selectWorkspaceItem(tasks, tasks[1].id)).toBe(tasks[1])
    expect(selectWorkspaceItem(tasks, "missing")).toBe(tasks[0])
    expect(selectWorkspaceItem([], "missing")).toBeUndefined()
  })

  test("chooses the artifact collection for each lifecycle", () => {
    expect(
      getVisibleArtifacts(workspaceSnapshots.start).map((item) => item.name)
    ).toEqual([
      "onboarding-flow.fig",
      "funnel-data.csv",
      "research-notes.pdf",
    ])
    expect(
      getVisibleArtifacts(workspaceSnapshots.running).map((item) => item.name)
    ).toEqual(["onboarding-flow.tsx", "funnel-analysis.md"])
    expect(
      getVisibleArtifacts(workspaceSnapshots.complete).map((item) => item.name)
    ).toEqual([
      "onboarding-flow.tsx",
      "funnel-analysis.md",
      "implementation-plan.md",
    ])
  })
})
