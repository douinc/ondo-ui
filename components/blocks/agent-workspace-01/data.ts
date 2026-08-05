export type WorkspaceStage = "start" | "running" | "complete"

type EventBase = {
  id: string
  availableAt: WorkspaceStage
}

export type WorkspaceEvent =
  | (EventBase & {
      kind: "message"
      role: "user" | "agent"
      text: string
    })
  | (EventBase & {
      kind: "marker"
      label: string
      detail: string
      milestone: boolean
      status: "idle" | "running" | "success" | "error"
    })
  | (EventBase & {
      kind: "attachment"
      fileName: string
      meta: string
      state: "idle" | "processing" | "done" | "error"
    })
  | (EventBase & {
      kind: "tool"
      title: string
      command: string
      output: string
      status: "pending" | "running" | "success" | "error"
    })

export type AttachmentState = Extract<
  WorkspaceEvent,
  { kind: "attachment" }
>["state"]

type ReaderAnchorEvent =
  | (Extract<WorkspaceEvent, { kind: "message" }> & { role: "user" })
  | (Extract<WorkspaceEvent, { kind: "marker" }> & { milestone: true })

export const workspaceTask = {
  id: "OND-247",
  title: "Build the agent workspace Block",
  repository: "initred/ondo-ui",
  branch: "feature/agent-workspace-block",
  summary: "Compose an installable coding-agent workspace from Ondo UI.",
} as const

export const workspaceFiles = [
  {
    path: "components/blocks/agent-workspace-01/page.tsx",
    status: "modified",
    additions: 146,
    deletions: 0,
  },
  {
    path: "components/blocks/agent-workspace-01/components/reader-rail.tsx",
    status: "modified",
    additions: 92,
    deletions: 0,
  },
  {
    path: "registry.json",
    status: "modified",
    additions: 54,
    deletions: 0,
  },
] as const

export const workspaceNavigation = {
  workspaces: ["ondo-ui", "dashboard-kit", "design-system"],
  recentTasks: [
    { id: "OND-247", label: "Agent workspace Block", status: "running" },
    { id: "OND-241", label: "MessageScroller docs", status: "complete" },
    { id: "OND-235", label: "Registry export audit", status: "complete" },
  ],
  agents: ["Codex", "Review", "Visual QA"],
} as const

export const workspaceEvents = [
  {
    id: "repository-ready",
    availableAt: "start",
    kind: "marker",
    label: "Repository ready",
    detail: "initred/ondo-ui · feature/agent-workspace-block",
    milestone: false,
    status: "idle",
  },
  {
    id: "context-design-spec",
    availableAt: "start",
    kind: "attachment",
    fileName: "agent-workspace-block-design.md",
    meta: "Design brief · 14 KB",
    state: "idle",
  },
  {
    id: "context-message-scroller",
    availableAt: "start",
    kind: "attachment",
    fileName: "message-scroller.mdx",
    meta: "Component reference · 31 KB",
    state: "idle",
  },
  {
    id: "request-agent-workspace",
    availableAt: "running",
    kind: "message",
    role: "user",
    text: "Build an agent workspace Block that follows the official shadcn Block presentation.\n\nUse Marker, Message, MessageScroller, Bubble, and Attachment as the core conversation experience.",
  },
  {
    id: "agent-plan",
    availableAt: "running",
    kind: "message",
    role: "agent",
    text: "I’ll keep the installed workspace separate from the documentation viewer, then model one task across start, running, and complete states.\n\nThe Reader Rail will track only the user request and major milestones so the outline stays useful.",
  },
  {
    id: "milestone-analyze",
    availableAt: "running",
    kind: "marker",
    label: "Analyze request",
    detail: "Inspect Block boundaries and reusable Ondo primitives",
    milestone: true,
    status: "success",
  },
  {
    id: "tool-inspect-repository",
    availableAt: "running",
    kind: "tool",
    title: "Inspect repository structure",
    command: "rg --files components app lib | sort",
    output:
      "Found catalog routes, registry primitives, and static export tooling.",
    status: "success",
  },
  {
    id: "milestone-edit",
    availableAt: "running",
    kind: "marker",
    label: "Edit files",
    detail: "Compose the workspace from existing Ondo UI components",
    milestone: true,
    status: "success",
  },
  {
    id: "tool-write-workspace",
    availableAt: "running",
    kind: "tool",
    title: "Apply workspace composition",
    command: "apply_patch components/blocks/agent-workspace-01",
    output:
      "Added the shell, conversation, Reader Rail, progress, and artifacts surfaces.",
    status: "success",
  },
  {
    id: "artifact-workspace-processing",
    availableAt: "running",
    kind: "attachment",
    fileName: "agent-workspace-01.tsx",
    meta: "Generating preview artifact",
    state: "processing",
  },
  {
    id: "milestone-verify",
    availableAt: "running",
    kind: "marker",
    label: "Run verification",
    detail: "Typecheck, test, and inspect the isolated preview",
    milestone: true,
    status: "running",
  },
  {
    id: "tool-run-verification",
    availableAt: "running",
    kind: "tool",
    title: "Run focused verification",
    command: "bun test && bun run typecheck",
    output: "Verification is running…",
    status: "running",
  },
  {
    id: "tool-verification-result",
    availableAt: "complete",
    kind: "tool",
    title: "Verification completed",
    command: "bun test && bun run typecheck",
    output: "86 tests passed. TypeScript completed with no errors.",
    status: "success",
  },
  {
    id: "artifact-workspace-ready",
    availableAt: "complete",
    kind: "attachment",
    fileName: "agent-workspace-01.tsx",
    meta: "Ready · 28 KB",
    state: "done",
  },
  {
    id: "artifact-optional-report-error",
    availableAt: "complete",
    kind: "attachment",
    fileName: "accessibility-report.html",
    meta: "Optional report could not be generated",
    state: "error",
  },
  {
    id: "milestone-complete",
    availableAt: "complete",
    kind: "marker",
    label: "Task complete",
    detail: "Workspace Block and delivery checks are ready",
    milestone: true,
    status: "success",
  },
  {
    id: "agent-summary",
    availableAt: "complete",
    kind: "message",
    role: "agent",
    text: "The Agent Workspace Block is ready. It uses one ordered lifecycle, keeps reader intent inside MessageScroller, and installs as a namespaced Ondo UI Block.\n\nThe optional accessibility report remains available to retry without blocking the completed task.",
  },
] as const satisfies readonly WorkspaceEvent[]

const stageRank: Record<WorkspaceStage, number> = {
  start: 0,
  running: 1,
  complete: 2,
}

export function getWorkspaceEvents(stage: WorkspaceStage) {
  return workspaceEvents.filter(
    (event) => stageRank[event.availableAt] <= stageRank[stage]
  )
}

export function isReaderAnchor(
  event: WorkspaceEvent
): event is ReaderAnchorEvent {
  return (
    (event.kind === "message" && event.role === "user") ||
    (event.kind === "marker" && event.milestone)
  )
}

export function getReaderRailItems(events: readonly WorkspaceEvent[]) {
  return events.filter(isReaderAnchor).map((event) => ({
    id: event.id,
    label: event.kind === "message" ? "User request" : event.label,
  }))
}

const attachmentStateLabels: Record<AttachmentState, string> = {
  idle: "Attached",
  processing: "Processing",
  done: "Ready",
  error: "Needs attention",
}

export function getAttachmentStateLabel(state: AttachmentState) {
  return attachmentStateLabels[state]
}
