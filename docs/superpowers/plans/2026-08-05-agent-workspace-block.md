# Agent Workspace Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ondo UI's first installable Block: a responsive, interactive, three-panel AI agent workspace with start, running, and complete previews on the bilingual `/blocks` gallery.

**Architecture:** One `registry:block` installs five focused source files under `components/blocks/agent-workspace/`. Typed local snapshots drive a client composition root; leaf components render navigation, the task thread, and artifacts. The existing server-rendered Blocks page embeds a site-only client preview, while registry metadata and an explicit namespaced install command make the Block discoverable and installable.

**Tech Stack:** Next.js 16.2.11 App Router with static export, React 19.2, TypeScript 5.9, Tailwind CSS 4, Base UI, existing Ondo UI primitives, Tabler Icons, Bun test, shadcn registry 4.16.

## Global Constraints

- Registry name and type are exactly `agent-workspace` and `registry:block`.
- Match shadcn's Block convention: discovery lives on `/blocks`, installation requires the explicit name `@ondo-ui/agent-workspace`, and the Block must not be added to the argument-free Ondo CLI picker or `--all`.
- Public lifecycle values are exactly `"start" | "running" | "complete"`; default status is `"start"`.
- The same onboarding-improvement task identity and Korean fixture content appear in all three snapshots; gallery chrome and metadata remain localized in English and Korean.
- Desktop `xl` shows a `16rem` left sidebar, flexible center, and `20rem` right panel. `md`–`lg` keeps an icon-collapsible left sidebar and moves the right panel to a Sheet. Below `md`, both side panels use Sheets and the thread fills the viewport.
- The Block defaults to `min-h-svh`; the gallery overrides it with `h-[720px] min-h-0`.
- No AI SDK transport, network request, filesystem access, persistence, authentication, automatic lifecycle timer, or new dependency beyond direct `@tabler/icons-react` use.
- Do not add or change anything under `components/ui/`; the repository's `.claude/skills/add-component/SKILL.md` workflow is therefore not triggered.
- Every directly imported Ondo registry item must use an `@ondo-ui/<name>` entry in `registryDependencies`; never use a bare internal dependency name.
- Keep `app/_shared/pages/blocks-page.tsx` as a Server Component. Put `"use client"` only on client entry points (`agent-workspace.tsx` and `agent-workspace-preview.tsx`) so interactive code does not pull the whole page into the client graph.
- Before changing any Next or React component, read these version-matched local guides completely:
  - `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
  - `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
- Do not stage or commit `.superpowers/`; it contains temporary brainstorming companion files.

---

### Task 1: Define the workspace data contract and lifecycle fixtures

**Files:**

- Create: `components/blocks/agent-workspace/workspace-data.ts`
- Create: `components/blocks/agent-workspace/workspace-data.test.ts`

**Interfaces:**

- Consumes: no feature code.
- Produces: `WorkspaceStatus`, `WorkspaceTaskStatus`, `WorkspacePlanStepStatus`, `WorkspaceMessage`, `WorkspaceTask`, `WorkspacePlanStep`, `WorkspaceArtifact`, `WorkspaceMetric`, `WorkspaceSnapshot`, `workspaceSnapshots`, `selectWorkspaceItem`, and `getVisibleArtifacts`.

- [ ] **Step 1: Write the failing selector and fixture-contract tests**

Create `workspace-data.test.ts` with these executable assertions:

```ts
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
    expect(getVisibleArtifacts(workspaceSnapshots.start).map((item) => item.name)).toEqual([
      "onboarding-flow.fig",
      "funnel-data.csv",
      "research-notes.pdf",
    ])
    expect(getVisibleArtifacts(workspaceSnapshots.running).map((item) => item.name)).toEqual([
      "onboarding-flow.tsx",
      "funnel-analysis.md",
    ])
    expect(getVisibleArtifacts(workspaceSnapshots.complete).map((item) => item.name)).toEqual([
      "onboarding-flow.tsx",
      "funnel-analysis.md",
      "implementation-plan.md",
    ])
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
bun test components/blocks/agent-workspace/workspace-data.test.ts
```

Expected: FAIL because `workspace-data.ts` and its exports do not exist.

- [ ] **Step 3: Implement the exact public data types**

Define the data boundary in `workspace-data.ts`:

```ts
export type WorkspaceStatus = "start" | "running" | "complete"
export type WorkspaceTaskStatus = "idle" | "running" | "complete"
export type WorkspacePlanStepStatus = "queued" | "running" | "complete"

export type WorkspaceMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type WorkspaceTask = {
  id: string
  title: string
  description: string
  status: WorkspaceTaskStatus
}

export type WorkspacePlanStep = {
  id: string
  label: string
  detail: string
  status: WorkspacePlanStepStatus
}

export type WorkspaceArtifact = {
  id: string
  name: string
  description: string
  meta: string
  kind: "design" | "data" | "document" | "code"
}

export type WorkspaceMetric = {
  label: string
  value: string
}

export type WorkspaceSnapshot = {
  status: WorkspaceStatus
  project: {
    id: string
    name: string
    description: string
  }
  tasks: WorkspaceTask[]
  selectedTaskId: string
  messages: WorkspaceMessage[]
  plan: WorkspacePlanStep[]
  contextFiles: WorkspaceArtifact[]
  changedFiles: WorkspaceArtifact[]
  deliverables: WorkspaceArtifact[]
  progress?: number
  currentAction?: string
  completion?: {
    title: string
    body: string
    metrics: WorkspaceMetric[]
    verification: string
  }
  composerPlaceholder: string
}
```

- [ ] **Step 4: Add the three complete fixture snapshots**

Use shared constants for the project and task identity, then export this record:

```ts
export const workspaceSnapshots = {
  start: {
    status: "start",
    project: productExperienceProject,
    tasks: startTasks,
    selectedTaskId: "onboarding-improvement",
    messages: [],
    plan: [],
    contextFiles,
    changedFiles: [],
    deliverables: [],
    composerPlaceholder: "추가 요청을 입력하세요…",
  },
  running: {
    status: "running",
    project: productExperienceProject,
    tasks: runningTasks,
    selectedTaskId: "onboarding-improvement",
    messages: runningMessages,
    plan: runningPlan,
    contextFiles,
    changedFiles,
    deliverables: [],
    progress: 64,
    currentAction:
      "첫 화면의 선택 부담을 줄이고 핵심 행동을 앞당기는 새 흐름을 작성 중입니다.",
    composerPlaceholder: "추가 지시를 입력하세요…",
  },
  complete: {
    status: "complete",
    project: productExperienceProject,
    tasks: completeTasks,
    selectedTaskId: "onboarding-improvement",
    messages: completeMessages,
    plan: completePlan,
    contextFiles,
    changedFiles,
    deliverables,
    progress: 100,
    completion: {
      title: "온보딩 개선안을 완료했습니다",
      body:
        "초기 선택 단계를 4개에서 2개로 줄이고, 첫 핵심 행동 전에 제품 가치를 확인할 수 있도록 흐름을 재구성했습니다.",
      metrics: [
        { label: "선택 단계", value: "−2" },
        { label: "산출물", value: "3" },
        { label: "검증 항목", value: "12" },
      ],
      verification: "12/12",
    },
    composerPlaceholder: "결과를 수정하거나 다음 작업을 요청하세요…",
  },
} satisfies Record<WorkspaceStatus, WorkspaceSnapshot>
```

Create the referenced constants with the exact visible names asserted in Step 1. `runningPlan` has five stages: current-flow analysis and funnel analysis are complete, improved-flow authoring is running, and prototype/report plus verification are queued. `completePlan` contains the same five stages marked complete. Include at least two additional sidebar tasks so task selection is visibly interactive.

- [ ] **Step 5: Implement safe selection helpers**

```ts
export function selectWorkspaceItem<T extends { id: string }>(
  items: readonly T[],
  requestedId: string | undefined
): T | undefined {
  return items.find((item) => item.id === requestedId) ?? items[0]
}

export function getVisibleArtifacts(
  snapshot: WorkspaceSnapshot
): WorkspaceArtifact[] {
  if (snapshot.status === "start") return snapshot.contextFiles
  if (snapshot.status === "running") return snapshot.changedFiles
  return snapshot.deliverables
}
```

- [ ] **Step 6: Run focused tests and commit**

```bash
bun test components/blocks/agent-workspace/workspace-data.test.ts
git add components/blocks/agent-workspace/workspace-data.ts components/blocks/agent-workspace/workspace-data.test.ts
git commit -m "feat: add agent workspace fixtures"
```

Expected: all fixture tests pass and only the two data files are committed.

---

### Task 2: Build the accessible task sidebar

**Files:**

- Create: `components/blocks/agent-workspace/workspace-sidebar.tsx`
- Create: `components/blocks/agent-workspace/workspace-sidebar.test.tsx`

**Interfaces:**

- Consumes: `WorkspaceSnapshot` from Task 1 and existing `button`, `dropdown-menu`, and `sidebar` primitives.
- Produces: `WorkspaceSidebarProps` and `WorkspaceSidebar`.

- [ ] **Step 1: Write failing server-render assertions**

Use `renderToStaticMarkup` so no DOM testing dependency is added:

```tsx
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { workspaceSnapshots } from "@/components/blocks/agent-workspace/workspace-data"
import { WorkspaceSidebar } from "@/components/blocks/agent-workspace/workspace-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

function renderSidebar(tasks = workspaceSnapshots.running.tasks) {
  const snapshot = { ...workspaceSnapshots.running, tasks }
  return renderToStaticMarkup(
    <TooltipProvider>
      <SidebarProvider>
        <WorkspaceSidebar
          snapshot={snapshot}
          selectedTaskId={snapshot.selectedTaskId}
          onNewTask={() => undefined}
          onTaskSelect={() => undefined}
        />
      </SidebarProvider>
    </TooltipProvider>
  )
}

describe("WorkspaceSidebar", () => {
  test("labels navigation and marks the selected task", () => {
    const html = renderSidebar()
    expect(html).toContain('aria-label="Workspace tasks"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain("온보딩 흐름 개선")
    expect(html).toContain("새 작업")
  })

  test("renders an explicit empty task state", () => {
    expect(renderSidebar([])).toContain("아직 작업이 없습니다")
  })
})
```

- [ ] **Step 2: Run the test and verify failure**

```bash
bun test components/blocks/agent-workspace/workspace-sidebar.test.tsx
```

Expected: FAIL because `WorkspaceSidebar` does not exist.

- [ ] **Step 3: Implement the sidebar contract and semantic structure**

Use this exact prop contract:

```ts
export type WorkspaceSidebarProps = {
  snapshot: WorkspaceSnapshot
  selectedTaskId: string | undefined
  onNewTask: () => void
  onTaskSelect: (taskId: string) => void
}
```

Render:

- `Sidebar` with `collapsible="icon"` and `aria-label="Workspace tasks"`;
- `SidebarHeader` containing an Ondo Agent mark and a `Button` labeled `새 작업`;
- one `SidebarGroup` for the current project and one for recent tasks;
- task buttons through `SidebarMenuButton`, with `isActive`, `aria-current="page"`, status text for assistive technology, and status-dot styling for sighted users;
- `SidebarFooter` with initials `JI`, user name `Jin`, and a `DropdownMenu` for profile/settings actions;
- a centered `아직 작업이 없습니다` message when `snapshot.tasks` is empty.

Use `IconSparkles`, `IconPlus`, `IconCircle`, `IconLoader2`, `IconCircleCheck`, and `IconDots` from `@tabler/icons-react`. Add `motion-safe:animate-spin` only to the running icon and hide redundant status icons from assistive technology.

- [ ] **Step 4: Run tests, typecheck the component, and commit**

```bash
bun test components/blocks/agent-workspace/workspace-sidebar.test.tsx
bunx eslint components/blocks/agent-workspace/workspace-sidebar.tsx components/blocks/agent-workspace/workspace-sidebar.test.tsx
bun run typecheck
git add components/blocks/agent-workspace/workspace-sidebar.tsx components/blocks/agent-workspace/workspace-sidebar.test.tsx
git commit -m "feat: add agent workspace sidebar"
```

Expected: tests, lint, and typecheck pass.

---

### Task 3: Build the lifecycle-aware task thread

**Files:**

- Create: `components/blocks/agent-workspace/workspace-thread.tsx`
- Create: `components/blocks/agent-workspace/workspace-thread.test.tsx`

**Interfaces:**

- Consumes: `WorkspaceMessage`, `WorkspaceSnapshot`, and existing `badge`, `bubble`, `collapsible`, `empty`, `input-group`, `message`, and `message-scroller` primitives.
- Produces: `WorkspaceThreadProps` and `WorkspaceThread`.

- [ ] **Step 1: Write failing lifecycle and composer tests**

```tsx
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
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
bun test components/blocks/agent-workspace/workspace-thread.test.tsx
```

Expected: FAIL because `WorkspaceThread` does not exist.

- [ ] **Step 3: Implement the thread prop contract**

```ts
export type WorkspaceThreadProps = {
  snapshot: WorkspaceSnapshot
  messages: WorkspaceMessage[]
  draft: string
  onDraftChange: (value: string) => void
  onSubmit: () => void
  sidebarTrigger?: React.ReactNode
  artifactsTrigger?: React.ReactNode
}
```

The header contains both optional panel triggers, the selected task title, and a text `Badge` whose variant is `secondary`, `warning`, or `success` for start, running, or complete.

- [ ] **Step 4: Implement the three thread bodies**

- Start: use `Empty`, `EmptyMedia`, `EmptyTitle`, and `EmptyDescription` for `무엇을 함께 개선할까요?`; render three suggestion chips beneath it.
- Running: render messages through `Message`, `MessageContent`, `Bubble`, and `BubbleContent`; render the plan in a `Collapsible` with each step carrying `data-state="queued|running|complete"`, visible state text, and a reduced-motion-safe running icon.
- Complete: render the same message log, then the completion title/body, a three-column metric grid, and a verification row containing `12/12`.
- Wrap non-empty conversation content in `MessageScrollerProvider`, `MessageScroller`, `MessageScrollerViewport`, and `MessageScrollerContent`. Set `role="log"`, `aria-live="polite"`, and `aria-relevant="additions"` on the content element.

- [ ] **Step 5: Implement the controlled composer**

Use a real form:

```tsx
<form
  onSubmit={(event) => {
    event.preventDefault()
    if (draft.trim()) onSubmit()
  }}
>
  <InputGroup>
    <InputGroupTextarea
      aria-label="Message"
      value={draft}
      placeholder={snapshot.composerPlaceholder}
      onChange={(event) => onDraftChange(event.target.value)}
    />
    <InputGroupAddon align="block-end">
      <InputGroupButton
        type="submit"
        variant="default"
        size="icon-sm"
        disabled={!draft.trim()}
        aria-label="Send message"
      >
        <IconArrowUp />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</form>
```

- [ ] **Step 6: Run tests, lint, typecheck, and commit**

```bash
bun test components/blocks/agent-workspace/workspace-thread.test.tsx
bunx eslint components/blocks/agent-workspace/workspace-thread.tsx components/blocks/agent-workspace/workspace-thread.test.tsx
bun run typecheck
git add components/blocks/agent-workspace/workspace-thread.tsx components/blocks/agent-workspace/workspace-thread.test.tsx
git commit -m "feat: add agent workspace thread"
```

Expected: all thread states and composer assertions pass.

---

### Task 4: Build the context and deliverables panel

**Files:**

- Create: `components/blocks/agent-workspace/workspace-artifacts.tsx`
- Create: `components/blocks/agent-workspace/workspace-artifacts.test.tsx`

**Interfaces:**

- Consumes: `WorkspaceSnapshot`, `getVisibleArtifacts`, `selectWorkspaceItem`, and existing `attachment`, `empty`, and `progress` primitives.
- Produces: `WorkspaceArtifactsProps` and `WorkspaceArtifacts`.

- [ ] **Step 1: Write failing artifact-state tests**

```tsx
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
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
bun test components/blocks/agent-workspace/workspace-artifacts.test.tsx
```

Expected: FAIL because `WorkspaceArtifacts` does not exist.

- [ ] **Step 3: Implement status headings and progress**

Use this prop contract:

```ts
export type WorkspaceArtifactsProps = {
  snapshot: WorkspaceSnapshot
  selectedArtifactId: string | undefined
  onArtifactSelect: (artifactId: string) => void
  className?: string
}
```

The root is an `aside` with `aria-label="Task context"`. Map headings to `작업 컨텍스트`, `진행 상황`, and `산출물`. For running state render `Progress`, `ProgressLabel`, and `ProgressValue` with `value={64}` and the localized current action.

- [ ] **Step 4: Implement selectable artifacts and the empty state**

Render `getVisibleArtifacts(snapshot)` as `Attachment` rows. Each row contains `AttachmentMedia`, `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription`, and an `AttachmentTrigger` with an accessible label containing the filename. Set `data-selected` from `selectWorkspaceItem`; visible selected styling uses theme tokens only. The complete state adds a full-width `모든 결과 검토` button. Render `Empty` with `표시할 파일이 없습니다` for start/running and `표시할 산출물이 없습니다` for complete when the visible collection is empty.

- [ ] **Step 5: Run tests, lint, typecheck, and commit**

```bash
bun test components/blocks/agent-workspace/workspace-artifacts.test.tsx
bunx eslint components/blocks/agent-workspace/workspace-artifacts.tsx components/blocks/agent-workspace/workspace-artifacts.test.tsx
bun run typecheck
git add components/blocks/agent-workspace/workspace-artifacts.tsx components/blocks/agent-workspace/workspace-artifacts.test.tsx
git commit -m "feat: add agent workspace artifacts"
```

Expected: all artifact state and empty-state tests pass.

---

### Task 5: Compose the interactive responsive Block

**Files:**

- Create: `components/blocks/agent-workspace/agent-workspace.tsx`
- Create: `components/blocks/agent-workspace/agent-workspace.test.tsx`

**Interfaces:**

- Consumes: `workspaceSnapshots`, `selectWorkspaceItem`, `WorkspaceSidebar`, `WorkspaceThread`, `WorkspaceArtifacts`, `SidebarProvider`, `SidebarInset`, `SidebarTrigger`, and `Sheet` primitives.
- Produces: `AgentWorkspace`, `AgentWorkspaceProps`, and re-exported `WorkspaceStatus`.

- [ ] **Step 1: Write failing public-contract and landmark tests**

```tsx
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
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
bun test components/blocks/agent-workspace/agent-workspace.test.tsx
```

Expected: FAIL because `AgentWorkspace` does not exist.

- [ ] **Step 3: Implement the client entry and controlled/uncontrolled status**

Start the file with `"use client"` and use this exact contract:

```ts
export type AgentWorkspaceProps = React.ComponentProps<"div"> & {
  status?: WorkspaceStatus
  defaultStatus?: WorkspaceStatus
  onStatusChange?: (status: WorkspaceStatus) => void
}
```

Resolve status with local state:

```ts
const [internalStatus, setInternalStatus] = React.useState<WorkspaceStatus>(
  defaultStatus
)
const resolvedStatus = status ?? internalStatus

const requestStatusChange = React.useCallback(
  (nextStatus: WorkspaceStatus) => {
    if (status === undefined) setInternalStatus(nextStatus)
    onStatusChange?.(nextStatus)
  },
  [onStatusChange, status]
)
```

Default `defaultStatus` to `"start"`. Do not mirror controlled props through an Effect.

- [ ] **Step 4: Add local selection, draft, and submitted-message state**

Maintain selected task and artifact IDs plus a `Record<WorkspaceStatus, string>` draft map. Resolve every selected ID with `selectWorkspaceItem` at render time so changing lifecycle or removing an item cannot crash. On mock submit, trim the draft, append a user `WorkspaceMessage` to the current status's local message array, and clear only that status's draft. Do not generate an assistant response and do not advance status.

Initialize the draft map so the start snapshot demonstrates the approved goal immediately:

```ts
{
  start: "온보딩 흐름을 분석하고 개선안을 구현해줘",
  running: "",
  complete: "",
}
```

The new-task action restores the start snapshot's selected task and artifact IDs, removes locally appended messages, restores the approved start draft, and calls `requestStatusChange("start")`.

- [ ] **Step 5: Compose the responsive shell**

Import `TooltipProvider` directly and wrap the responsive shell so installed Blocks do not depend on an application-level provider. Use:

```tsx
<TooltipProvider>
  <SidebarProvider
    className={cn("min-h-svh overflow-hidden", className)}
    style={{
      "--sidebar-width": "16rem",
      "--sidebar-width-icon": "3rem",
      ...style,
    } as React.CSSProperties}
  >
    <WorkspaceSidebar />
    <SidebarInset aria-label="Agent task thread">
      <WorkspaceThread />
    </SidebarInset>
    <WorkspaceArtifacts className="hidden w-80 shrink-0 xl:flex" />
  </SidebarProvider>
</TooltipProvider>
```

Pass `SidebarTrigger` into the thread header. Add a second labeled `Button` with `aria-label="Open task context"` and `xl:hidden`; it opens a right-side `Sheet` containing `SheetTitle`, `SheetDescription`, and `WorkspaceArtifacts`. The existing `Sidebar` primitive supplies the mobile left Sheet and icon-collapsed tablet behavior. Keep the persistent right panel out of the accessibility tree below `xl` by using the responsive `hidden` class rather than visually moving it off-screen.

- [ ] **Step 6: Run all Block tests and commit**

```bash
bun test components/blocks/agent-workspace
bunx eslint components/blocks/agent-workspace
bun run typecheck
git add components/blocks/agent-workspace/agent-workspace.tsx components/blocks/agent-workspace/agent-workspace.test.tsx
git commit -m "feat: compose agent workspace block"
```

Expected: every Block unit/render test passes with no type or lint errors.

---

### Task 6: Register the Block and its metadata

**Files:**

- Create: `lib/blocks-list.ts`
- Create: `lib/blocks-list.test.ts`
- Modify: `registry.json`
- Modify: `scripts/registry-dependencies.test.ts`
- Modify: `scripts/ondo-cli.test.ts`

**Interfaces:**

- Consumes: the five production source files from Tasks 1–5.
- Produces: `blocksList`, a valid `registry:block`, executable registration/dependency invariants, and a regression test for explicit-only Block installation.

- [ ] **Step 1: Write failing Block registration tests**

Create `lib/blocks-list.test.ts`:

```ts
import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

import { blocksList } from "@/lib/blocks-list"

type Registry = {
  items: Array<{
    name: string
    type: string
    files?: Array<{ path: string }>
    registryDependencies?: string[]
  }>
}

describe("blocksList", () => {
  test("matches every public registry block", async () => {
    const registry = JSON.parse(
      await readFile(new URL("../registry.json", import.meta.url), "utf8")
    ) as Registry
    const registryBlocks = registry.items.filter(
      (item) => item.type === "registry:block"
    )

    expect(blocksList.map((item) => item.name)).toEqual(
      registryBlocks.map((item) => item.name)
    )
    expect(registryBlocks[0].files?.map((file) => file.path)).toEqual([
      "components/blocks/agent-workspace/agent-workspace.tsx",
      "components/blocks/agent-workspace/workspace-sidebar.tsx",
      "components/blocks/agent-workspace/workspace-thread.tsx",
      "components/blocks/agent-workspace/workspace-artifacts.tsx",
      "components/blocks/agent-workspace/workspace-data.ts",
    ])
  })
})
```

Extend `scripts/registry-dependencies.test.ts` with a test that finds `agent-workspace`, expects type `registry:block`, expects `@tabler/icons-react` in `dependencies`, and expects this exact sorted direct registry dependency set:

```ts
[
  "@ondo-ui/attachment",
  "@ondo-ui/badge",
  "@ondo-ui/bubble",
  "@ondo-ui/button",
  "@ondo-ui/collapsible",
  "@ondo-ui/dropdown-menu",
  "@ondo-ui/empty",
  "@ondo-ui/input-group",
  "@ondo-ui/message",
  "@ondo-ui/message-scroller",
  "@ondo-ui/progress",
  "@ondo-ui/sheet",
  "@ondo-ui/sidebar",
  "@ondo-ui/tooltip",
  "@ondo-ui/utils",
]
```

Extend the existing registry fixtures in `scripts/ondo-cli.test.ts` with:

```ts
{
  name: "agent-workspace",
  type: "registry:block",
  files: [
    { path: "components/blocks/agent-workspace/agent-workspace.tsx" },
  ],
}
```

Keep the existing Components/Compositions selection expectations unchanged and add these assertions:

```ts
const blockItem = registry.items.find(
  (item) => item.name === "agent-workspace"
)

expect(classifyRegistryItem(blockItem)).toBeNull()
expect(getSelectableNames(registry, "all")).not.toContain("agent-workspace")
expect(buildRegistryChoices(registry).some(
  (choice) => choice.value === "agent-workspace"
)).toBe(false)
```

Change the explicit-add delegation case to call `runAdd(["agent-workspace", "--dry-run"], ...)` and expect `args: ["@ondo-ui/agent-workspace", "--dry-run"]`. This protects the shadcn convention: exact names install, while the argument-free picker and `--all` omit Blocks.

- [ ] **Step 2: Run the focused tests and verify failure**

```bash
bun test lib/blocks-list.test.ts scripts/registry-dependencies.test.ts scripts/ondo-cli.test.ts
```

Expected: FAIL because `blocksList` and the registry item do not exist.

- [ ] **Step 3: Create the Block metadata list**

```ts
export const blocksList = [
  {
    name: "agent-workspace",
    title: "Agent Workspace",
    description: {
      en: "A full-screen AI workspace with task navigation, agent progress, and reviewable deliverables.",
      ko: "작업 탐색, 에이전트 진행 과정, 검토 가능한 산출물을 담은 전체 화면 AI 워크스페이스입니다.",
    },
  },
] as const
```

- [ ] **Step 4: Add the registry item**

Add this item to `registry.json` after the existing `registry:component` items:

```json
{
  "name": "agent-workspace",
  "type": "registry:block",
  "description": "A full-screen AI workspace with task navigation, agent progress, and reviewable deliverables.",
  "dependencies": ["@tabler/icons-react"],
  "registryDependencies": [
    "@ondo-ui/attachment",
    "@ondo-ui/badge",
    "@ondo-ui/bubble",
    "@ondo-ui/button",
    "@ondo-ui/collapsible",
    "@ondo-ui/dropdown-menu",
    "@ondo-ui/empty",
    "@ondo-ui/input-group",
    "@ondo-ui/message",
    "@ondo-ui/message-scroller",
    "@ondo-ui/progress",
    "@ondo-ui/sheet",
    "@ondo-ui/sidebar",
    "@ondo-ui/tooltip",
    "@ondo-ui/utils"
  ],
  "files": [
    {
      "path": "components/blocks/agent-workspace/agent-workspace.tsx",
      "type": "registry:block"
    },
    {
      "path": "components/blocks/agent-workspace/workspace-sidebar.tsx",
      "type": "registry:block"
    },
    {
      "path": "components/blocks/agent-workspace/workspace-thread.tsx",
      "type": "registry:block"
    },
    {
      "path": "components/blocks/agent-workspace/workspace-artifacts.tsx",
      "type": "registry:block"
    },
    {
      "path": "components/blocks/agent-workspace/workspace-data.ts",
      "type": "registry:block"
    }
  ]
}
```

Implement the five Block files using the direct imports declared by this exact dependency set. Do not retain unused registry dependencies or add a dependency solely to satisfy the test.

- [ ] **Step 5: Verify source and built registry payloads**

```bash
bun test lib/blocks-list.test.ts scripts/registry-dependencies.test.ts scripts/ondo-cli.test.ts
bun run registry:build
jq '{name,type,dependencies,registryDependencies,files}' public/r/agent-workspace.json
```

Expected: tests pass; the payload name/type are correct; all five source files and namespaced dependencies appear. `public/r/` remains ignored and unstaged.

- [ ] **Step 6: Commit registration**

```bash
git add lib/blocks-list.ts lib/blocks-list.test.ts registry.json scripts/registry-dependencies.test.ts scripts/ondo-cli.test.ts
git commit -m "feat: register agent workspace block"
```

---

### Task 7: Publish the interactive bilingual Blocks gallery

**Files:**

- Create: `components/block-previews/agent-workspace-preview.tsx`
- Create: `app/_shared/pages/blocks-page.test.tsx`
- Modify: `app/_shared/pages/blocks-page.tsx`
- Modify: `lib/dictionaries.ts`
- Modify: `scripts/verify-static-export.ts`

**Interfaces:**

- Consumes: `AgentWorkspace`, `WorkspaceStatus`, `blocksList`, `CodeBlockCommand`, and existing `Tabs` primitives.
- Produces: `AgentWorkspacePreview`, localized preview labels, and rendered English/Korean `/blocks` pages.

- [ ] **Step 1: Write failing Blocks page render tests**

```tsx
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
    expect(html).toContain("npx shadcn@latest add @ondo-ui/agent-workspace")
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
```

- [ ] **Step 2: Run the page test and verify failure**

```bash
bun test app/_shared/pages/blocks-page.test.tsx
```

Expected: FAIL because the page still renders the coming-soon placeholder.

- [ ] **Step 3: Add localized gallery copy**

Replace `comingSoon` and `comingSoonDescription` in both dictionaries with:

```ts
item: {
  title: "Agent Workspace",
  install: "Install",
  previewLabel: "Workspace state",
  states: {
    start: "Start",
    running: "Running",
    complete: "Complete",
  },
}
```

The Korean object must preserve the same shape with `title: "에이전트 워크스페이스"`, `install: "설치"`, `previewLabel: "워크스페이스 상태"`, and state labels `시작`, `진행`, `완료`. Keep `blocks.title` and `blocks.description` unchanged.

- [ ] **Step 4: Implement the site-only controlled preview**

Create a client component with serializable labels:

```tsx
"use client"

import * as React from "react"

import {
  AgentWorkspace,
  type WorkspaceStatus,
} from "@/components/blocks/agent-workspace/agent-workspace"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function AgentWorkspacePreview({
  labels,
  ariaLabel,
}: {
  labels: Record<WorkspaceStatus, string>
  ariaLabel: string
}) {
  const [status, setStatus] = React.useState<WorkspaceStatus>("start")

  return (
    <Tabs
      value={status}
      onValueChange={(value) => setStatus(value as WorkspaceStatus)}
      className="gap-4"
    >
      <TabsList aria-label={ariaLabel}>
        {(["start", "running", "complete"] as const).map((value) => (
          <TabsTrigger key={value} value={value}>
            {labels[value]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={status} className="overflow-hidden rounded-xl border">
        <AgentWorkspace status={status} className="h-[720px] min-h-0" />
      </TabsContent>
    </Tabs>
  )
}
```

- [ ] **Step 5: Replace the placeholder with the Block gallery item**

In the Server Component `BlocksPage`, read `blocksList[0]`, then render:

- localized title (`Agent Workspace` for English and `에이전트 워크스페이스` for Korean);
- `blocksList[0].description[locale]`;
- a `relative` command container with `CodeBlockCommand` configured as `__npm__="npx shadcn@latest add @ondo-ui/agent-workspace"`, `__pnpm__="pnpm dlx shadcn@latest add @ondo-ui/agent-workspace"`, `__yarn__="yarn dlx shadcn@latest add @ondo-ui/agent-workspace"`, and `__bun__="bunx --bun shadcn@latest add @ondo-ui/agent-workspace"`;
- `AgentWorkspacePreview` with localized lifecycle labels and `ariaLabel={dict.blocks.item.previewLabel}`;
- a container wide enough for a three-panel preview (`max-w-[1600px]`) while preserving the existing heading alignment.

Do not add a new route. Keep metadata generation in `getBlocksMetadata` unchanged.

- [ ] **Step 6: Require both static Block routes**

Add `/blocks/` and `/ko/blocks/` to the `requiredPaths` set in `scripts/verify-static-export.ts` alongside the existing component routes. This makes removal or export failure explicit.

- [ ] **Step 7: Run page, type, and lint checks and commit**

```bash
bun test app/_shared/pages/blocks-page.test.tsx
bunx eslint components/block-previews/agent-workspace-preview.tsx app/_shared/pages/blocks-page.tsx app/_shared/pages/blocks-page.test.tsx lib/blocks-list.ts lib/dictionaries.ts scripts/verify-static-export.ts
bun run typecheck
git add components/block-previews/agent-workspace-preview.tsx app/_shared/pages/blocks-page.tsx app/_shared/pages/blocks-page.test.tsx lib/dictionaries.ts scripts/verify-static-export.ts
git commit -m "feat: publish agent workspace block gallery"
```

Expected: both localized render tests pass and no Next client/server boundary error appears.

---

### Task 8: Verify behavior, installation payload, and visual quality

**Files:**

- Verify: all files changed by Tasks 1–7.
- Modify only if verification reveals an in-scope defect.

**Interfaces:**

- Consumes: the complete Block, registry, gallery, and localization changes.
- Produces: evidence that every acceptance criterion passes.

- [ ] **Step 1: Run the complete focused test set**

```bash
bun test components/blocks/agent-workspace lib/blocks-list.test.ts app/_shared/pages/blocks-page.test.tsx scripts/registry-dependencies.test.ts scripts/ondo-cli.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 2: Run repository-wide static checks**

```bash
bun run typecheck
bun run lint
bun test
```

Expected: all commands exit 0 with no new warnings attributable to the Block.

- [ ] **Step 3: Build and inspect the registry/static export**

```bash
bun run build
jq '{name,type,dependencies,registryDependencies,files}' public/r/agent-workspace.json
test -f out/blocks.html -o -f out/blocks/index.html
test -f out/ko/blocks.html -o -f out/ko/blocks/index.html
```

Expected: the build and export verifier pass; the payload contains five Block files; both Block routes exist.

- [ ] **Step 4: Verify local installation contract without touching the repository**

Use a disposable directory and the generated payload. Do not use the repository root as an install target.

```bash
agent_workspace_tmp=$(mktemp -d)
cp components.json "$agent_workspace_tmp/components.json"
jq '.files | map(.path)' public/r/agent-workspace.json
```

Expected: the JSON lists the same five paths asserted by `lib/blocks-list.test.ts`. If running an actual `shadcn add` against a locally served `out/r` payload, point `--cwd` only at `$agent_workspace_tmp` and remove the temporary directory afterward.

- [ ] **Step 5: Perform browser visual and interaction QA**

Invoke the Browser skill, start `bun run dev`, and inspect `/blocks` plus `/ko/blocks` at these viewport widths:

- `1440px`: three visible panels, `16rem` left and `20rem` right, no horizontal overflow;
- `1024px`: icon-collapsible left sidebar, right panel available through its Sheet trigger;
- `390px`: thread-only default view, left and right Sheet triggers usable, no clipped composer.

For each width:

1. switch Start → Running → Complete;
2. open and close each available panel using keyboard controls;
3. confirm focus returns to the trigger after Sheet close;
4. select a task and artifact;
5. verify blank composer submission is disabled and a non-empty local message appends;
6. repeat once in light mode and once in dark mode;
7. enable reduced motion and confirm running indicators do not rely on motion to convey status.

Expected: every interaction works and the approved visual hierarchy matches the design spec.

- [ ] **Step 6: Inspect the final diff and commit only verification fixes**

```bash
git diff --check
git status --short
git diff --stat
git log --oneline -10
```

Expected: `.superpowers/`, `public/r/`, build output, and unrelated files are unstaged; implementation commits correspond to Tasks 1–7. If Step 1–5 required fixes, stage only those exact files and commit them as:

```bash
git commit -m "fix: finalize agent workspace block"
```

Do not create an empty verification commit when no fixes were necessary.
