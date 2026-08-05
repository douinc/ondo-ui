# Agent Workspace Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `agent-workspace-01`, a complete Ondo UI agent workspace Block with reader-position-aware conversation states, and present it through a shadcn-style iframe/code Block viewer.

**Architecture:** Keep the installable Block under `components/blocks/agent-workspace-01/` and keep catalog/viewer infrastructure site-only. A deterministic event fixture drives Start, In progress, and Complete; `MessageScroller` owns transcript anchoring and visibility while a derived Reader Rail navigates only user turns and major milestone Markers. The localized catalog reads `registry:block` metadata, the desktop preview renders the Block through a statically generated `/view/[name]/` route, and compact catalog layouts use captured screenshots.

**Tech Stack:** Next.js 16.2.11 App Router and static export, React 19.2.4, TypeScript 5.9, Tailwind CSS 4, Base UI, Ondo UI registry primitives, `@shadcn/react` MessageScroller, Shiki, Puppeteer 23.6, Bun test, shadcn 4.16.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-05-agent-workspace-block-design.md` exactly.
- Before editing route code, read `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`, and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`.
- `output: "export"` and `trailingSlash: true` remain enabled; every dynamic Block/category route must return all values from `generateStaticParams()` and set `dynamicParams = false`.
- Do not add, rename, or modify a primitive under `components/ui/`. If implementation proves that a new primitive is necessary, stop and follow `.claude/skills/add-component/SKILL.md` before changing scope.
- Marker, Message, MessageScroller, Bubble, and Attachment are mandatory core conversation primitives.
- Every direct transcript row has a stable `messageId`; only user requests and major milestone Markers receive `scrollAnchor`.
- The final Reader Rail destinations are User request, Analyze request, Edit files, Run verification, and Task complete.
- A reader who scrolls away from the live edge must not be pulled back by new content.
- The Block uses one ordered fixture for `"start" | "running" | "complete"`; the default catalog preview stage is `"running"`.
- The `/blocks` page never renders the full Block directly; desktop uses `/view/agent-workspace-01/` in an iframe and compact catalog layouts use captured light/dark images.
- All local registry dependencies use the `@ondo-ui/` namespace.
- The supported install command is exactly `npx shadcn@latest add @ondo-ui/agent-workspace-01`.
- No AI backend, persistence, repository API, network request, demo timer, or `DesktopWindow` is part of the installed Block.
- Preserve the existing English/Korean route structure and static export contract.

## File Map

### Registry and catalog data

- Create `lib/blocks.ts`: Block metadata filtering, featured/category lists, static params, source language helpers, and install/preview asset URLs.
- Create `lib/blocks.test.ts`: pure Block filtering, params, command, and URL tests.
- Modify `registry.json`: add the `agent-workspace-01` `registry:block` item.
- Modify `scripts/registry-dependencies.test.ts`: assert the Block entry, files, target, and namespaced dependencies.

### Installable Block

- Create `components/blocks/agent-workspace-01/data.ts`: workspace types, ordered fixture, stage filtering, anchor policy, Reader Rail derivation, files, and navigation data.
- Create `components/blocks/agent-workspace-01/data.test.ts`: stage, ID, attachment state, and anchor tests.
- Create `components/blocks/agent-workspace-01/components/conversation-row.tsx`: map each event kind to Message/Bubble, Marker, Attachment, or Collapsible.
- Create `components/blocks/agent-workspace-01/components/reader-rail.tsx`: current-anchor controller and accessible desktop/mobile rail views.
- Create `components/blocks/agent-workspace-01/components/conversation-panel.tsx`: MessageScroller provider, viewport, rows, rail, and return-to-latest control.
- Create `components/blocks/agent-workspace-01/components/conversation-panel.test.tsx`: static primitive composition and Reader Rail state tests.
- Create `components/blocks/agent-workspace-01/components/agent-sidebar.tsx`: workspace/recent-task/file navigation.
- Create `components/blocks/agent-workspace-01/components/workspace-header.tsx`: repository, branch, lifecycle status, and mobile panel controls.
- Create `components/blocks/agent-workspace-01/components/task-progress.tsx`: Timeline, Progress, ProgressRing, and verification summary.
- Create `components/blocks/agent-workspace-01/components/artifact-panel.tsx`: Context/Changes/Artifacts tabs using Frame, Item, Alert, and Attachment.
- Create `components/blocks/agent-workspace-01/components/prompt-composer.tsx`: context attachments and InputGroup-based prompt controls.
- Create `components/blocks/agent-workspace-01/page.tsx`: responsive shell and controlled lifecycle tabs.
- Create `components/blocks/agent-workspace-01/page.test.tsx`: stage-specific server-rendered structure tests.
- Create `components/blocks/index.ts`: site-only preview component map.

### Isolated preview and Block viewer

- Create `app/(en)/(view)/view/[name]/page.tsx`: statically generated isolated Block route.
- Create `lib/block-source.ts`: read declared source files, build file trees, and return highlighted payloads.
- Create `lib/block-source.test.ts`: file-tree and language resolution tests.
- Create `components/block-display.tsx`: server-side Block item/source preparation.
- Create `components/block-viewer.tsx`: client Preview/Code toolbar and responsive preview state.
- Create `components/block-viewer-file-tree.tsx`: Sidebar/Collapsible file navigation and highlighted code panel.
- Create `components/block-viewer.test.ts`: pure viewport, command, preview URL, and screenshot URL tests.

### Catalog routes and publishing verification

- Create `components/blocks-nav.tsx`: localized Featured/AI/Workspace navigation.
- Modify `app/_shared/pages/blocks-page.tsx`: page header, nav, filtered BlockDisplay list, and empty category behavior.
- Create `app/(en)/(app)/blocks/[category]/page.tsx`: English category route.
- Create `app/(ko)/ko/(app)/blocks/[category]/page.tsx`: Korean category route.
- Modify `lib/dictionaries.ts`: localized Block viewer/catalog labels.
- Create `scripts/capture-blocks.ts`: official-style light/dark Block screenshot capture.
- Modify `package.json` and `bun.lock`: add `puppeteer@^23.6.0` and `blocks:capture`.
- Add `public/r/styles/base-vega/agent-workspace-01-light.png` and `public/r/styles/base-vega/agent-workspace-01-dark.png` with forced Git tracking because `/public/r` is ignored.
- Modify `scripts/verify-static-export.ts`: require Block catalog, category, view, registry, and screenshot outputs.
- Modify `scripts/smoke-static-export.ts`: smoke-test the same public routes and payload.

---

### Task 1: Add Block catalog and route helpers (TDD)

**Files:**

- Create: `lib/blocks.ts`
- Create: `lib/blocks.test.ts`

**Interfaces:**

- Produces `BlockItem`, `BlockCategory`, and `BlockViewport` types.
- Produces `FEATURED_BLOCK_NAMES`, `BLOCK_CATEGORIES`, and `BLOCK_VIEWPORTS` constants.
- Produces `listBlockItems(items, category?)`, `getBlockItem(items, name)`, `getBlockNameStaticParams(items)`, and `getBlockCategoryStaticParams()`.
- Produces `getBlockInstallCommand(name)`, `getBlockPreviewUrl(name)`, `getBlockScreenshotUrl(name, theme)`, and `getBlockSourceLanguage(path)`.
- Later tasks consume these helpers in the preview route, viewer, catalog, capture script, and tests.

- [ ] **Step 1: Write failing pure helper tests**

Create `lib/blocks.test.ts` with an injected registry fixture:

```ts
import { describe, expect, test } from "bun:test"

import {
  BLOCK_CATEGORIES,
  getBlockCategoryStaticParams,
  getBlockInstallCommand,
  getBlockNameStaticParams,
  getBlockPreviewUrl,
  getBlockScreenshotUrl,
  getBlockSourceLanguage,
  listBlockItems,
} from "@/lib/blocks"

const items = [
  { name: "button", type: "registry:ui", files: [] },
  {
    name: "agent-workspace-01",
    type: "registry:block",
    description: "Agent workspace",
    categories: ["ai", "workspace"],
    files: [
      {
        path: "components/blocks/agent-workspace-01/page.tsx",
        type: "registry:page",
        target: "app/agent-workspace/page.tsx",
      },
    ],
    meta: { iframeHeight: "900px" },
  },
] as const

describe("Block catalog helpers", () => {
  test("lists only registry:block items and filters categories", () => {
    expect(listBlockItems(items)).toHaveLength(1)
    expect(listBlockItems(items, "ai").map((item) => item.name)).toEqual([
      "agent-workspace-01",
    ])
    expect(listBlockItems(items, "login")).toEqual([])
  })

  test("builds every static param", () => {
    expect(getBlockNameStaticParams(items)).toEqual([
      { name: "agent-workspace-01" },
    ])
    expect(getBlockCategoryStaticParams()).toEqual(
      BLOCK_CATEGORIES.map(({ slug }) => ({ category: slug }))
    )
  })

  test("builds namespaced commands and static asset URLs", () => {
    expect(getBlockInstallCommand("agent-workspace-01")).toBe(
      "npx shadcn@latest add @ondo-ui/agent-workspace-01"
    )
    expect(getBlockPreviewUrl("agent-workspace-01")).toBe(
      "/view/agent-workspace-01/"
    )
    expect(getBlockScreenshotUrl("agent-workspace-01", "dark")).toBe(
      "/r/styles/base-vega/agent-workspace-01-dark.png"
    )
  })

  test("maps source extensions to Shiki languages", () => {
    expect(getBlockSourceLanguage("page.tsx")).toBe("tsx")
    expect(getBlockSourceLanguage("data.ts")).toBe("ts")
    expect(getBlockSourceLanguage("fixture.json")).toBe("json")
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
bun test lib/blocks.test.ts
```

Expected: FAIL because `@/lib/blocks` does not exist.

- [ ] **Step 3: Implement the helper module**

Define these public constants:

```ts
export const FEATURED_BLOCK_NAMES = ["agent-workspace-01"] as const

export const BLOCK_CATEGORIES = [
  { name: { en: "AI", ko: "AI" }, slug: "ai" },
  { name: { en: "Workspace", ko: "워크스페이스" }, slug: "workspace" },
] as const

export const BLOCK_VIEWPORTS = {
  desktop: "100%",
  tablet: "60%",
  mobile: "30%",
} as const
```

Use a structural `BlockItem` type that accepts read-only injected fixtures and imported JSON items. `listBlockItems` preserves registry order, rejects non-Block items, and requires category membership only when a category exists. `getBlockSourceLanguage` returns `tsx`, `ts`, `json`, `css`, or `text` from the final extension.

- [ ] **Step 4: Run the focused test and typecheck**

```bash
bun test lib/blocks.test.ts
bun run typecheck
```

Expected: tests pass and the project typechecks.

- [ ] **Step 5: Commit**

```bash
git add lib/blocks.ts lib/blocks.test.ts
git commit -m "feat: add block catalog helpers"
```

---

### Task 2: Model the Agent Workspace lifecycle and anchor policy (TDD)

**Files:**

- Create: `components/blocks/agent-workspace-01/data.ts`
- Create: `components/blocks/agent-workspace-01/data.test.ts`

**Interfaces:**

- Produces `WorkspaceStage = "start" | "running" | "complete"`.
- Produces discriminated `WorkspaceEvent` message, marker, attachment, and tool variants.
- Produces `workspaceEvents`, `workspaceFiles`, `workspaceNavigation`, and `workspaceTask` fixture data.
- Produces `getWorkspaceEvents(stage)`, `isReaderAnchor(event)`, `getReaderRailItems(events)`, and `getAttachmentStateLabel(state)`.
- Conversation, rail, progress, artifact, and shell components consume these exports.

- [ ] **Step 1: Write the failing lifecycle tests**

```ts
import { describe, expect, test } from "bun:test"

import {
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
    expect(complete).toEqual(workspaceEvents)
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
})
```

- [ ] **Step 2: Run the test and verify failure**

```bash
bun test components/blocks/agent-workspace-01/data.test.ts
```

Expected: FAIL because the fixture module does not exist.

- [ ] **Step 3: Implement exact event types and stage filtering**

```ts
export type WorkspaceStage = "start" | "running" | "complete"

type EventBase = {
  id: string
  availableAt: WorkspaceStage
}

export type WorkspaceEvent =
  | (EventBase & { kind: "message"; role: "user" | "agent"; text: string })
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
```

Use numeric stage rank so filtering preserves a prefix. Start contains repository-ready context, Running appends the user request through verification-in-progress, and Complete appends verification output, one failed optional artifact example, and Task complete. The ready Marker has `milestone: false`.

- [ ] **Step 4: Implement anchor and rail derivation**

```ts
export function isReaderAnchor(event: WorkspaceEvent) {
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
```

Give every event a unique literal ID and keep the five approved anchor IDs exactly as tested.

- [ ] **Step 5: Run tests and typecheck**

```bash
bun test components/blocks/agent-workspace-01/data.test.ts
bun run typecheck
```

Expected: all fixture and anchor tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/blocks/agent-workspace-01/data.ts components/blocks/agent-workspace-01/data.test.ts
git commit -m "feat: model agent workspace lifecycle"
```

---

### Task 3: Build the MessageScroller conversation and Reader Rail (TDD)

**Files:**

- Create: `components/blocks/agent-workspace-01/components/conversation-row.tsx`
- Create: `components/blocks/agent-workspace-01/components/reader-rail.tsx`
- Create: `components/blocks/agent-workspace-01/components/conversation-panel.tsx`
- Create: `components/blocks/agent-workspace-01/components/conversation-panel.test.tsx`

**Interfaces:**

- `ConversationRow({ event }: { event: WorkspaceEvent })` maps one fixture event to Ondo conversation primitives.
- `ReaderRailList({ items, currentAnchorId, onSelect })` is shared by desktop and mobile overlays.
- `ReaderRail({ items })` consumes `useMessageScroller()` and `useMessageScrollerVisibility()`.
- `ConversationPanel({ stage }: { stage: WorkspaceStage })` owns the provider/scroller tree.

- [ ] **Step 1: Write failing static composition tests**

```tsx
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { ConversationRow } from "@/components/blocks/agent-workspace-01/components/conversation-row"
import { ReaderRailList } from "@/components/blocks/agent-workspace-01/components/reader-rail"

describe("agent workspace conversation", () => {
  test("renders user messages with Message and Bubble", () => {
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
    expect(html).toContain('data-slot="bubble"')
    expect(html).toContain("Build an agent workspace")
  })

  test("marks the current Reader Rail destination", () => {
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

    expect(html).toContain('aria-current="location"')
    expect(html).toContain("Analyze request")
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
bun test components/blocks/agent-workspace-01/components/conversation-panel.test.tsx
```

Expected: FAIL because the conversation components do not exist.

- [ ] **Step 3: Implement event-to-primitive rendering**

`ConversationRow` renders:

- user message: right-aligned `Message`, `MessageContent`, muted `Bubble`, and `BubbleContent`;
- agent message: left-aligned `Message`, `Avatar`, `MessageContent`, and ghost `Bubble`;
- marker: `Marker`, `MarkerIcon`, and `MarkerContent`; completion uses `variant="separator"`, running uses `Spinner`, error uses destructive semantic classes;
- attachment: `Attachment` with the fixture state, media, title, description, and retry/remove actions for errors;
- tool: `Collapsible` with a `Button` trigger, command in `Kbd`, status `Badge`, and preformatted output.

Paragraph-split multiline Bubble text with the MessageScroller demo's `split(/\n\s*\n/)`, trim, filter, and `whitespace-pre-wrap` pattern.

- [ ] **Step 4: Implement the rail view and hook controller**

`ReaderRailList` uses Ondo `Button` rows and `aria-current="location"`. `ReaderRail` obtains:

```ts
const { scrollToMessage } = useMessageScroller()
const { currentAnchorId } = useMessageScrollerVisibility()
```

Its selection handler is:

```ts
function selectAnchor(messageId: string) {
  scrollToMessage(messageId, {
    align: "start",
    behavior: "smooth",
  })
}
```

Desktop uses `HoverCard` and a vertical dot trigger matching Tracking the Reader's Position. Compact layouts use `Popover`. Both use one `ReaderRailList`, both triggers have `aria-label="Open conversation outline"`, and an empty list renders no trigger.

- [ ] **Step 5: Implement the scroller tree**

```tsx
<MessageScrollerProvider defaultScrollPosition="last-anchor" scrollMargin={12}>
  <div className="relative flex min-h-0 flex-1">
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent aria-busy={stage === "running"}>
          {events.map((event) => (
            <MessageScrollerItem
              key={event.id}
              messageId={event.id}
              scrollAnchor={isReaderAnchor(event)}
            >
              <ConversationRow event={event} />
            </MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
    <ReaderRail items={getReaderRailItems(events)} />
  </div>
</MessageScrollerProvider>
```

Keep the composer outside this component and do not set forced auto-scroll. The
`last-anchor` default makes a reopened saved transcript land on its last
meaningful request or milestone without taking scroll control away after the
reader moves.

- [ ] **Step 6: Run focused checks**

```bash
bun test components/blocks/agent-workspace-01/components/conversation-panel.test.tsx components/blocks/agent-workspace-01/data.test.ts
bun run typecheck
bunx eslint components/blocks/agent-workspace-01/components/conversation-row.tsx components/blocks/agent-workspace-01/components/reader-rail.tsx components/blocks/agent-workspace-01/components/conversation-panel.tsx
```

Expected: tests pass with no type or lint errors.

- [ ] **Step 7: Commit**

```bash
git add components/blocks/agent-workspace-01/components/conversation-row.tsx components/blocks/agent-workspace-01/components/reader-rail.tsx components/blocks/agent-workspace-01/components/conversation-panel.tsx components/blocks/agent-workspace-01/components/conversation-panel.test.tsx
git commit -m "feat: build agent workspace conversation"
```

---

### Task 4: Compose the complete responsive workspace shell (TDD)

**Files:**

- Create: `components/blocks/agent-workspace-01/components/agent-sidebar.tsx`
- Create: `components/blocks/agent-workspace-01/components/workspace-header.tsx`
- Create: `components/blocks/agent-workspace-01/components/task-progress.tsx`
- Create: `components/blocks/agent-workspace-01/components/artifact-panel.tsx`
- Create: `components/blocks/agent-workspace-01/components/prompt-composer.tsx`
- Create: `components/blocks/agent-workspace-01/page.tsx`
- Create: `components/blocks/agent-workspace-01/page.test.tsx`

**Interfaces:**

- `AgentWorkspaceBlock({ initialStage?: WorkspaceStage })` is the installed interactive root; default is `"running"`.
- `AgentWorkspaceStage({ stage })` is the deterministic renderer used by the interactive root.
- Supporting components consume Task 2 fixture exports and existing Ondo UI primitives.

- [ ] **Step 1: Write failing lifecycle markup tests**

```tsx
import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { AgentWorkspaceBlock } from "@/components/blocks/agent-workspace-01/page"

describe("AgentWorkspaceBlock", () => {
  test.each([
    ["start", "Repository connected"],
    ["running", "Run verification"],
    ["complete", "Task complete"],
  ] as const)("renders the %s lifecycle state", (stage, expectedText) => {
    const html = renderToStaticMarkup(
      <AgentWorkspaceBlock initialStage={stage} />
    )

    expect(html).toContain(`data-stage="${stage}"`)
    expect(html).toContain(expectedText)
  })

  test("defaults the interactive preview to running", () => {
    const html = renderToStaticMarkup(<AgentWorkspaceBlock />)
    expect(html).toContain('data-stage="running"')
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
bun test components/blocks/agent-workspace-01/page.test.tsx
```

Expected: FAIL because the workspace page does not exist.

- [ ] **Step 3: Build the shell and lifecycle controller**

`AgentWorkspaceBlock` is a client component with controlled `Tabs` state:

```tsx
export function AgentWorkspaceBlock({
  initialStage = "running",
}: {
  initialStage?: WorkspaceStage
}) {
  const [stage, setStage] = React.useState<WorkspaceStage>(initialStage)

  return (
    <Tabs
      value={stage}
      onValueChange={(value) => setStage(value as WorkspaceStage)}
      className="h-svh min-h-160 gap-0 bg-background"
    >
      <AgentWorkspaceStage stage={stage} />
    </Tabs>
  )
}
```

Place Start, In progress, and Complete `TabsTrigger`s in `WorkspaceHeader`. `AgentWorkspaceStage` uses `SidebarProvider`, `Sidebar`, `SidebarInset`, and a horizontal `ResizablePanelGroup`: conversation is primary and inspector is secondary. Compact layouts hide the fixed inspector and expose it through `Sheet`; Sidebar's existing mobile Sheet owns navigation.

- [ ] **Step 4: Implement the five supporting surfaces with exact primitive ownership**

- `AgentSidebar`: `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, recent-task badges, repository files, `SidebarFooter`, `Avatar`, `DropdownMenu`, and `Tooltip`.
- `WorkspaceHeader`: `SidebarTrigger`, `Heading`, `Breadcrumb`, branch `Badge`, lifecycle `TabsList`, icon `Button`s for search and Inspector Sheet, and `Separator`.
- `TaskProgress`: `Frame`, `ProgressRing`, `Progress`, and `Timeline` with Analyze/Edit/Verify/Complete steps.
- `ArtifactPanel`: `Tabs` for Context/Changes/Artifacts; `FramePanel`; changed-file `Item` rows; completion `Alert`; context/output `Attachment`s; `ScrollArea`.
- `PromptComposer`: selected `AttachmentGroup`; multiline `InputGroup`; `InputGroupTextarea`; block-end `InputGroupAddon`; attach/model/send `InputGroupButton`s; `ButtonGroup`; `Kbd`; labeled `Tooltip`s. Disable send only in Complete.

Use one task/repository/branch/prompt across stages. Do not add Card or DesktopWindow wrappers.

- [ ] **Step 5: Run workspace checks**

```bash
bun test components/blocks/agent-workspace-01/page.test.tsx components/blocks/agent-workspace-01/components/conversation-panel.test.tsx components/blocks/agent-workspace-01/data.test.ts
bun run typecheck
bunx eslint components/blocks/agent-workspace-01
```

Expected: all tests and checks pass.

- [ ] **Step 6: Commit**

```bash
git add components/blocks/agent-workspace-01
git commit -m "feat: compose agent workspace shell"
```

---

### Task 5: Register the Block and add the isolated static preview (TDD)

**Files:**

- Modify: `registry.json`
- Modify: `scripts/registry-dependencies.test.ts`
- Create: `components/blocks/index.ts`
- Create: `app/(en)/(view)/view/[name]/page.tsx`
- Modify: `lib/blocks.test.ts`

**Interfaces:**

- Registry produces `@ondo-ui/agent-workspace-01` with page target `app/agent-workspace/page.tsx`.
- `blockPreviews` maps Block names to renderable components.
- `getBlockPreview(name)` returns the mapped component or `undefined`.
- `/view/[name]/` consumes `getBlockNameStaticParams(registry.items)` and `getBlockPreview(name)`.

- [ ] **Step 1: Add failing registry source assertions**

Extend the test-local `RegistryItem` type in `scripts/registry-dependencies.test.ts` with `type` and `files`, then add:

```ts
test("registers agent-workspace-01 as a complete namespaced Block", async () => {
  const registry = await readRegistry()
  const block = registry.items.find(
    (item) => item.name === "agent-workspace-01"
  )

  expect(block?.type).toBe("registry:block")
  expect(block?.files).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path: "components/blocks/agent-workspace-01/page.tsx",
        type: "registry:page",
        target: "app/agent-workspace/page.tsx",
      }),
    ])
  )
  expect(
    block?.registryDependencies?.every((name) => name.startsWith("@ondo-ui/"))
  ).toBe(true)
})
```

- [ ] **Step 2: Run the registry test and verify failure**

```bash
bun test scripts/registry-dependencies.test.ts
```

Expected: FAIL because the Block entry is absent.

- [ ] **Step 3: Add the complete registry item**

Add one `registry:block` entry with:

- description `An agent workspace with conversation, task progress, and artifacts.`;
- dependency `@tabler/icons-react`;
- categories `ai` and `workspace`;
- `meta.iframeHeight` equal to `900px`;
- `data.ts` as `registry:file` with target `components/blocks/agent-workspace-01/data.ts`;
- page target `app/agent-workspace/page.tsx`;
- all eight supporting component files from the File Map as `registry:component`;
- this complete direct dependency set:

```json
[
  "@ondo-ui/alert",
  "@ondo-ui/attachment",
  "@ondo-ui/avatar",
  "@ondo-ui/badge",
  "@ondo-ui/breadcrumb",
  "@ondo-ui/bubble",
  "@ondo-ui/button",
  "@ondo-ui/button-group",
  "@ondo-ui/collapsible",
  "@ondo-ui/dropdown-menu",
  "@ondo-ui/frame",
  "@ondo-ui/heading",
  "@ondo-ui/hover-card",
  "@ondo-ui/input-group",
  "@ondo-ui/item",
  "@ondo-ui/kbd",
  "@ondo-ui/marker",
  "@ondo-ui/message",
  "@ondo-ui/message-scroller",
  "@ondo-ui/popover",
  "@ondo-ui/progress",
  "@ondo-ui/progress-ring",
  "@ondo-ui/resizable",
  "@ondo-ui/scroll-area",
  "@ondo-ui/separator",
  "@ondo-ui/sheet",
  "@ondo-ui/sidebar",
  "@ondo-ui/spinner",
  "@ondo-ui/tabs",
  "@ondo-ui/timeline",
  "@ondo-ui/tooltip"
]
```

Remove a dependency only when no Block file imports it directly. Add a dependency only when a direct Block import requires it.

- [ ] **Step 4: Add the preview map and static route**

`components/blocks/index.ts`:

```ts
import AgentWorkspacePage from "@/components/blocks/agent-workspace-01/page"

export const blockPreviews = {
  "agent-workspace-01": AgentWorkspacePage,
} as const

export function getBlockPreview(name: string) {
  return blockPreviews[name as keyof typeof blockPreviews]
}
```

The Next.js 16 route awaits Promise params and enumerates every Registry Block:

```tsx
import { notFound } from "next/navigation"

import registry from "@/registry.json"
import { getBlockPreview } from "@/components/blocks"
import { getBlockNameStaticParams } from "@/lib/blocks"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getBlockNameStaticParams(registry.items)
}

export default async function BlockPreviewPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const Preview = getBlockPreview(name)
  if (!Preview) notFound()
  return <Preview />
}
```

Keep the route under `(en)/(view)`, outside `(app)`, so root providers remain but `AppLayout`, `SiteHeader`, and `SiteFooter` do not render.

- [ ] **Step 5: Run registry tests, build the Registry, and inspect the payload**

```bash
bun test scripts/registry-dependencies.test.ts lib/blocks.test.ts
bun run registry:build
jq '{name,type,files,registryDependencies,categories,meta}' public/r/agent-workspace-01.json
```

Expected: tests pass; generated name/type are correct; the page target and every source file are present; all Ondo dependencies are namespaced.

- [ ] **Step 6: Run typecheck and commit source files**

```bash
bun run typecheck
git status --short
git add registry.json scripts/registry-dependencies.test.ts components/blocks/index.ts 'app/(en)/(view)/view/[name]/page.tsx' lib/blocks.test.ts
git commit -m "feat: register agent workspace block"
```

Expected: ignored `public/r` JSON output is not committed.

---

### Task 6: Build the shadcn-style BlockDisplay and BlockViewer (TDD)

**Files:**

- Create: `lib/block-source.ts`
- Create: `lib/block-source.test.ts`
- Create: `components/block-display.tsx`
- Create: `components/block-viewer.tsx`
- Create: `components/block-viewer-file-tree.tsx`
- Create: `components/block-viewer.test.ts`

**Interfaces:**

- `BlockFileTreeNode = { name: string; path?: string; children?: BlockFileTreeNode[] }`.
- `createBlockFileTree(files)` builds a deterministic target-based tree.
- `loadBlockDisplayData(item)` returns `{ tree, files }` with raw/highlighted source.
- `BlockDisplay({ name, locale })` loads one Registry item and renders `BlockViewer`.
- `BlockViewer` owns Preview/Code, viewport, refresh, and active-file state.

- [ ] **Step 1: Write failing source-tree and viewer helper tests**

Create `lib/block-source.test.ts`:

```ts
import { expect, test } from "bun:test"

import { createBlockFileTree } from "@/lib/block-source"

test("builds a target-based Block file tree", () => {
  expect(
    createBlockFileTree([
      { path: "source/page.tsx", target: "app/agent-workspace/page.tsx" },
      {
        path: "source/reader-rail.tsx",
        target:
          "components/blocks/agent-workspace-01/components/reader-rail.tsx",
      },
    ])
  ).toEqual([
    expect.objectContaining({ name: "app", children: expect.any(Array) }),
    expect.objectContaining({
      name: "components",
      children: expect.any(Array),
    }),
  ])
})
```

Create `components/block-viewer.test.ts` using Task 1 helpers to assert all viewport percentages, the namespaced command, preview URL, and both screenshot theme URLs.

- [ ] **Step 2: Run focused tests and verify failure**

```bash
bun test lib/block-source.test.ts components/block-viewer.test.ts
```

Expected: FAIL because `lib/block-source.ts` is missing.

- [ ] **Step 3: Implement server-only Block source preparation**

Keep `lib/block-source.ts` imported only by server components and Bun tests; do not add a `server-only` package that the repository does not currently depend on. Build the tree without mutating input. For each declared file:

1. read `file.path` with `readFileFromRoot`;
2. choose language with `getBlockSourceLanguage`;
3. call `highlightCode(source, language)`;
4. expose `file.target ?? file.path` as the install path.

Use `Promise.all` for concurrent highlighting. Throw `Block source file not found: <path>` and retain the original error as `cause`.

- [ ] **Step 4: Implement `BlockDisplay`**

Import `registry.json`, resolve with `getBlockItem`, return `null` when absent, and call `loadBlockDisplayData`. Pass labels from `getDictionary(locale).blocks.viewer` plus serializable item, file, and tree data into `BlockViewer`.

- [ ] **Step 5: Implement the client Viewer shell**

Mirror official shadcn behavior with Ondo primitives:

- `Tabs` for Preview/Code;
- `ToggleGroup` values `desktop`, `tablet`, and `mobile`, mapped through `BLOCK_VIEWPORTS` and the resizable panel `resize()` API;
- `ResizablePanelGroup` with iframe first and empty panel second;
- new-tab and refresh `Button`s; refresh increments an iframe key;
- install `Button` copying `getBlockInstallCommand(item.name)` through `copyToClipboardWithMeta`;
- iframe `src={getBlockPreviewUrl(item.name)}` and height `item.meta?.iframeHeight ?? "930px"`;
- compact branch with `next/image` light/dark screenshots;
- Code branch with fixed-height file tree and selected highlighted source.

Use the official dotted-grid background and 30% minimum preview size. Do not render the installed Block inline in desktop catalog mode.

- [ ] **Step 6: Implement focused file navigation**

`BlockViewerFileTree` starts with `"use client"` and uses `SidebarProvider`, non-collapsible `Sidebar`, `SidebarGroup`, recursive Ondo `Collapsible` folders, and active `SidebarMenuButton` leaves. The source panel uses a semantic `figure`, file caption, highlighted HTML, and `CopyButton` with raw source.

- [ ] **Step 7: Run focused checks**

```bash
bun test lib/block-source.test.ts components/block-viewer.test.ts
bun run typecheck
bunx eslint lib/block-source.ts components/block-display.tsx components/block-viewer.tsx components/block-viewer-file-tree.tsx
```

Expected: tests and checks pass.

- [ ] **Step 8: Commit**

```bash
git add lib/block-source.ts lib/block-source.test.ts components/block-display.tsx components/block-viewer.tsx components/block-viewer-file-tree.tsx components/block-viewer.test.ts
git commit -m "feat: add shadcn-style block viewer"
```

---

### Task 7: Publish localized Block catalog and category routes (TDD)

**Files:**

- Create: `components/blocks-nav.tsx`
- Modify: `app/_shared/pages/blocks-page.tsx`
- Create: `app/(en)/(app)/blocks/[category]/page.tsx`
- Create: `app/(ko)/ko/(app)/blocks/[category]/page.tsx`
- Modify: `lib/dictionaries.ts`
- Modify: `lib/blocks.test.ts`

**Interfaces:**

- `BlocksNav({ locale })` renders localized Featured, AI, and Workspace routes.
- `BlocksPage({ locale, category? })` renders header, nav, and catalog.
- Category pages return `getBlockCategoryStaticParams()` and await Promise params.
- Dictionary produces catalog and Viewer labels in both locales.

- [ ] **Step 1: Add failing real-Registry and dictionary assertions**

Extend `lib/blocks.test.ts`:

```ts
import registry from "@/registry.json"
import { getDictionary } from "@/lib/dictionaries"

test("publishes agent-workspace-01 in featured, ai, and workspace views", () => {
  expect(listBlockItems(registry.items).map((item) => item.name)).toContain(
    "agent-workspace-01"
  )
  expect(listBlockItems(registry.items, "ai").map((item) => item.name)).toEqual(
    ["agent-workspace-01"]
  )
  expect(
    listBlockItems(registry.items, "workspace").map((item) => item.name)
  ).toEqual(["agent-workspace-01"])
})

test("localizes Block viewer labels", () => {
  expect(getDictionary("en").blocks.viewer.preview).toBe("Preview")
  expect(getDictionary("ko").blocks.viewer.preview).toBe("미리 보기")
})
```

- [ ] **Step 2: Run the focused test and verify dictionary failure**

```bash
bun test lib/blocks.test.ts
```

Expected: Registry assertions pass after Task 5; viewer label assertions fail.

- [ ] **Step 3: Replace coming-soon copy with localized catalog labels**

Keep `blocks.title`, update the description, and add `featured`, `browseComponents`, `emptyCategory`, and this exact viewer shape in both locales:

```ts
viewer: {
  preview: "Preview",
  code: "Code",
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
  openNewTab: "Open in new tab",
  refresh: "Refresh preview",
  files: "Files",
  copyInstall: "Copy install command",
}
```

Use natural Korean equivalents: `미리 보기`, `코드`, `데스크톱`, `태블릿`, `모바일`, `새 탭에서 열기`, `미리 보기 새로고침`, `파일`, and `설치 명령 복사`.

- [ ] **Step 4: Implement category navigation**

`BlocksNav` uses `usePathname`, `localizeHref`, Ondo `ScrollArea`, and horizontal `ScrollBar`. Featured links to `/blocks`; categories link to `/blocks/ai` and `/blocks/workspace`. Active state uses `data-active`.

- [ ] **Step 5: Implement shared catalog and category routes**

Make `BlocksPage` async and render:

1. centered page header with title, description, and localized Components `Button` link;
2. horizontal `BlocksNav` separated from content;
3. `BlockDisplay` list with `gap-12 md:gap-24`;
4. localized empty copy only for an empty category.

Featured follows `FEATURED_BLOCK_NAMES`; categories preserve Registry order. Each category route exports `dynamic = "force-static"`, `dynamicParams = false`, `generateStaticParams`, and awaits `params: Promise<{ category: string }>`.

- [ ] **Step 6: Run tests, typecheck, and build**

```bash
bun test lib/blocks.test.ts
bun run typecheck
bun run artifacts:build
bun run registry:build
bunx next build
```

Expected: Next exports both locale catalog/category routes and `/view/agent-workspace-01/`. The full repository build and static-reference verification wait for Task 8's screenshot assets.

- [ ] **Step 7: Commit**

```bash
git add components/blocks-nav.tsx app/_shared/pages/blocks-page.tsx 'app/(en)/(app)/blocks/[category]/page.tsx' 'app/(ko)/ko/(app)/blocks/[category]/page.tsx' lib/dictionaries.ts lib/blocks.test.ts
git commit -m "feat: publish localized block catalog"
```

---

### Task 8: Capture screenshots and verify registry installation/export

**Files:**

- Create: `scripts/capture-blocks.ts`
- Modify: `package.json`
- Modify: `bun.lock`
- Add: `public/r/styles/base-vega/agent-workspace-01-light.png`
- Add: `public/r/styles/base-vega/agent-workspace-01-dark.png`
- Modify: `scripts/verify-static-export.ts`
- Modify: `scripts/smoke-static-export.ts`

**Interfaces:**

- `bun run blocks:capture [base-url]` captures Registry Blocks; default URL is `http://localhost:3000`.
- Static verification requires screenshots, catalog routes, isolated preview, and registry payload.
- Final consumer verification installs the local exported `@ondo-ui/agent-workspace-01`.

- [ ] **Step 1: Add capture dependency and command**

```bash
bun add --dev puppeteer@^23.6.0
```

Add:

```json
"blocks:capture": "bun run scripts/capture-blocks.ts"
```

- [ ] **Step 2: Implement deterministic light/dark capture**

`scripts/capture-blocks.ts` must:

- load Block names through `getBlockNameStaticParams(registry.items)`;
- create `public/r/styles/base-vega` recursively;
- launch Puppeteer at 1440 by 900 with `deviceScaleFactor: 2`;
- set `localStorage.theme` with `page.evaluateOnNewDocument` before navigation;
- visit `${baseUrl}/view/${name}/` with `waitUntil: "networkidle0"`;
- await `document.fonts.ready` and two animation frames instead of a fixed delay;
- capture only the viewport to `${name}-${theme}.png`;
- skip existing images unless `--force` is passed;
- close page and browser handles in `finally` blocks;
- report Block name/theme and exit non-zero on failure.

- [ ] **Step 3: Capture and inspect images**

First terminal:

```bash
bun run dev
```

Second terminal:

```bash
bun run blocks:capture --force
```

Expected: both images show the Running stage at the full workspace viewport with no site header/footer. Inspect both before proceeding.

- [ ] **Step 4: Extend static and smoke contracts**

Require these paths in `scripts/verify-static-export.ts` and `scripts/smoke-static-export.ts`:

```text
/blocks/
/ko/blocks/
/blocks/ai/
/blocks/workspace/
/ko/blocks/ai/
/ko/blocks/workspace/
/view/agent-workspace-01/
/r/agent-workspace-01.json
/r/styles/base-vega/agent-workspace-01-light.png
/r/styles/base-vega/agent-workspace-01-dark.png
```

Treat catalog/view routes as HTML. Parse the Block payload and assert `name === "agent-workspace-01"`, `type === "registry:block"`, and page target `app/agent-workspace/page.tsx`.

- [ ] **Step 5: Run complete automated verification**

```bash
bun test
bun run typecheck
bun run lint
bun run build
```

Expected: all checks pass; exported registry, preview, catalog/category routes, and screenshots exist.

- [ ] **Step 6: Serve and smoke-test the export**

First terminal:

```bash
python3 -m http.server 4173 --directory out
```

Second terminal:

```bash
bun run scripts/smoke-static-export.ts http://127.0.0.1:4173
```

Expected: every new and existing smoke URL passes.

- [ ] **Step 7: Verify a namespaced install against the local export**

Create a temporary Next-compatible consumer:

```bash
AGENT_WORKSPACE_CONSUMER="$(mktemp -d)"
bunx create-next-app@latest "$AGENT_WORKSPACE_CONSUMER" --typescript --tailwind --eslint --app --no-src-dir --import-alias '@/*' --use-bun --yes
cd "$AGENT_WORKSPACE_CONSUMER"
```

Create `components.json` with this complete configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "tabler",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@ondo-ui": "http://127.0.0.1:4173/r/{name}.json"
  }
}
```

Run:

```bash
npx shadcn@latest add @ondo-ui/agent-workspace-01 --yes
bunx tsc --noEmit
```

Expected: `app/agent-workspace/page.tsx`, all eight supporting components, fixture data, referenced Ondo primitives, and npm dependencies install without imports back to the source repository or viewer. The consumer typecheck passes. Then run:

```bash
rg -n '@/components/block-|@/registry|components/demos|/Users/initred/Code/ondo-ui' app components
```

Expected: no matches.

- [ ] **Step 8: Commit screenshots, tooling, and verification updates**

```bash
git add scripts/capture-blocks.ts package.json bun.lock scripts/verify-static-export.ts scripts/smoke-static-export.ts
git add -f public/r/styles/base-vega/agent-workspace-01-light.png public/r/styles/base-vega/agent-workspace-01-dark.png
git commit -m "test: verify agent workspace block delivery"
```

- [ ] **Step 9: Inspect final branch state**

```bash
git diff d1aa9a4...HEAD --check
git status --short
git log --oneline d1aa9a4..HEAD
```

Expected: clean worktree; approved design/plan, implementation, tests, capture tooling, and two screenshots only. Generated JSON/HTML and temporary consumer files remain untracked or outside the repository.

## Final Visual QA

After automated checks pass, inspect:

1. `/blocks/` and `/ko/blocks/` at desktop/tablet/mobile: header, category nav, toolbar, iframe, localized controls, screenshots, and Code tree.
2. `/view/agent-workspace-01/`: no site chrome; Start/In progress/Complete preserve one task identity.
3. Running transcript: Reader Rail highlights and navigates all five approved anchors.
4. Reader intent: scroll upward, expand Tool Collapsible content, and load Attachment media; position stays fixed until return-to-latest is activated.
5. Responsive shell: Sidebar and Inspector become Sheets without resetting transcript position.
6. Complete state: completion Marker, final Message/Bubble, done/error Attachments, changed-file Items, Timeline, Progress, and Alert are coherent.
7. Code view: every declared Block file is selectable, highlighted, and copyable.
8. Dark mode: isolated preview, iframe, and captured dark image use Ondo tokens without contrast regressions.
