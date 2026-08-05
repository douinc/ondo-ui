# Agent Workspace Block Design

## Goal

Add the first Ondo UI Block: `agent-workspace-01`, a complete agent workspace
template inspired by modern coding-agent and coworking interfaces. The Block
must demonstrate one continuous task in ready, running, and complete states and
must use Ondo UI's conversation primitives as the foundation of the experience.

The Block catalog and preview must follow the shadcn Block presentation model:
the catalog renders a site-only viewer, the live Block renders on an isolated
route, code is available as a multi-file tree, and the registry item installs as
a complete page package.

## Non-goals

- Do not add new primitives under `components/ui/` for this Block.
- Do not embed the full workspace directly inside the `/blocks` page layout.
- Do not require an AI backend, persistence layer, repository integration, or
  network request to use the installed template.
- Do not put the site-only Block viewer, catalog navigation, or screenshot
  tooling in the installed registry item.
- Do not use every Ondo UI primitive indiscriminately. Every dependency must
  have a visible product role.

## Reference model

The shadcn Blocks implementation separates five responsibilities:

1. An authored `registry:block` item describes a page, its supporting files,
   registry dependencies, categories, and preview metadata.
2. The Blocks catalog selects featured or categorized item names.
3. A server-side display layer loads the registry item, creates its file tree,
   and highlights every source file.
4. A client-side viewer owns Preview/Code state, responsive viewport controls,
   iframe refresh, install-command copy, and code-file selection.
5. A separate `/view/...` route renders only the Block, without the documentation
   site's header, footer, or content container. Desktop uses this route in an
   iframe; compact catalog layouts use captured light and dark screenshots.

Ondo UI should preserve those boundaries while omitting shadcn's multi-style
dimension. The Ondo preview route can therefore use `/view/[name]/` instead of
`/view/[style]/[name]/`.

## Architecture

```text
/blocks and /ko/blocks
  -> BlockDisplay (server)
     -> registry metadata + file tree + highlighted source
     -> BlockViewer (client)
        -> Preview: iframe /view/agent-workspace-01/
        -> Code: source tree and selected highlighted file
        -> Install: @ondo-ui/agent-workspace-01

/view/agent-workspace-01/
  -> AgentWorkspaceBlock

registry.json
  -> agent-workspace-01 (registry:block)
     -> page and supporting Block files
     -> existing @ondo-ui/* dependencies
```

### Site-only catalog layer

The localized Blocks pages retain the normal Ondo site header and footer and
add a Blocks page header, category navigation, and one `BlockDisplay` per
catalog item. They never render `AgentWorkspaceBlock` inline.

`BlockDisplay` is a server component. It loads the registry item, reads its
declared files, builds a display tree from their targets, and highlights the
source with the repository's existing `highlightCode` utility. It passes only
serializable item metadata, tree data, and highlighted source to the client
viewer.

`BlockViewer` owns:

- Preview and Code tabs;
- desktop, tablet, and mobile preview widths in an Ondo `Resizable` group;
- opening the isolated preview in a new tab;
- refreshing the iframe;
- copying `npx shadcn@latest add @ondo-ui/agent-workspace-01`;
- a source file tree composed from Ondo `Sidebar`, `Collapsible`, and
  `ScrollArea` primitives;
- per-file source copy actions.

Desktop previews use the isolated route in an iframe. Compact catalog layouts
use committed 1440 by 900 light and dark screenshots captured from the same
route, avoiding a full desktop workspace squeezed into the documentation
container.

### Installed Block layer

The registry package contains only the reusable workspace page, deterministic
demo data, and focused workspace components. The intended source structure is:

```text
components/blocks/agent-workspace-01/
├── page.tsx
├── data.ts
└── components/
    ├── agent-sidebar.tsx
    ├── workspace-header.tsx
    ├── conversation-panel.tsx
    ├── reader-rail.tsx
    ├── task-progress.tsx
    ├── artifact-panel.tsx
    └── prompt-composer.tsx
```

The page file installs to `app/agent-workspace/page.tsx`. Supporting Block
components remain grouped as Block-owned composition code rather than being
published as new `registry:ui` primitives.

## Workspace layout

```text
┌──────────────┬──────────────────────────────────┬──────────────────┐
│ Workspace    │ Repository / Task Header         │ Context          │
│ Sidebar      ├──────────────────────────────────┤ Changes          │
│              │                                  │ Artifacts        │
│ Recent Tasks │       MessageScroller         ┊  │                  │
│ Files        │       Message / Bubble         ┊  │ Timeline         │
│ Agents       │       Marker / Attachment      ┊  │ Progress         │
│              │                        Reader Rail│                  │
│              ├──────────────────────────────────┤                  │
│              │ Attachment + Prompt Composer     │                  │
└──────────────┴──────────────────────────────────┴──────────────────┘
```

The desktop shell uses `Sidebar` for workspace navigation and `Resizable` for
the conversation and inspector boundary. The center conversation is the
primary surface. The right inspector uses Tabs for Context, Changes, and
Artifacts and does not duplicate transcript navigation.

On compact screens, workspace navigation and the inspector move into separate
`Sheet` surfaces. The transcript and Reader Rail remain mounted so opening or
closing a Sheet does not reset reading position.

The Block is a real application surface, not a fake operating-system mockup.
It does not wrap itself in `DesktopWindow`; iframe isolation already supplies
the preview boundary.

## Conversation composition

The conversation is one height-constrained `MessageScrollerProvider` tree:

```text
MessageScrollerProvider
  -> MessageScroller
     -> MessageScrollerViewport
        -> MessageScrollerContent
           -> MessageScrollerItem[]
     -> MessageScrollerButton
  -> ReaderRail
```

Every direct transcript row is a `MessageScrollerItem` with a stable
`messageId`. This includes messages, standalone markers, and standalone
attachments. The row boundary lets MessageScroller measure content, preserve
position as rows change height, track visibility, and navigate directly to an
item.

The conversation primitives have distinct roles:

- `Message` defines participant alignment and message structure.
- `Bubble` contains user requests and agent responses. User requests use the
  muted variant; agent narrative uses the ghost variant.
- `Marker` represents system status and meaningful agent milestones such as
  analyzing, editing, verifying, completion, or failure.
- `Attachment` represents user-provided context, files being processed, and
  completed or failed outputs. It uses its idle, processing, done, and error
  states instead of custom file cards.
- `MessageScroller` owns reading-position preservation, turn anchoring,
  visibility tracking, and return-to-latest behavior.

The prompt composer is outside the scroll viewport and remains fixed at the
bottom. It is built with `InputGroup`, `InputGroupTextarea`,
`InputGroupButton`, `AttachmentTrigger`, `ButtonGroup`, and `Tooltip`.

## Anchor policy and Reader Rail

Every transcript row participates in measurement, but only two semantic row
types receive `scrollAnchor`:

1. user requests that begin a new turn;
2. major agent milestone Markers.

Individual tool calls, streaming fragments, and ordinary attachments are not
anchors. This prevents the outline from becoming a log of implementation
noise.

For the complete fixture, the Reader Rail has five destinations:

```text
User request
Analyze request
Edit files
Run verification
Task complete
```

`useMessageScrollerVisibility()` supplies `currentAnchorId`. The compact rail
highlights that anchor even after it has moved just above the viewport. On
desktop, the rail opens an Ondo `HoverCard` containing labeled Ondo `Button`
rows. On touch layouts it uses a `Popover` trigger with the same destinations.
Selecting a destination calls `scrollToMessage(messageId, { align: "start",
behavior: "smooth" })`.

The rail is positioned at the right edge of the conversation and does not
consume inspector width. It uses `aria-current="location"` for the current
destination and exposes a labeled trigger. It does not guess a fallback
position if an item has not mounted.

## Lifecycle fixtures

The top-level Block demo exposes Start, In progress, and Complete through Ondo
`Tabs`. These states are prefixes of one ordered event fixture, not three
unrelated mockups. Shared repository, branch, task, file, and prompt data remain
stable across all states.

### Start

- A Marker confirms the connected repository and branch.
- An Attachment group shows selected context files.
- The prompt composer is ready for the request.
- The ready Marker is informational rather than an agent-phase anchor, so the
  Reader Rail remains inactive until the first user turn exists.

### In progress

- The submitted user `Message` is right aligned and uses a muted `Bubble`.
- Context Attachments remain associated with that request.
- The agent response is left aligned and uses a ghost `Bubble` for plan text.
- Analyze request, Edit files, and Run verification Markers appear as major
  anchors.
- Individual tool calls and command output appear in Ondo `Collapsible`
  sections beneath the related agent response and do not become anchors.
- Files currently being handled use `Attachment state="processing"` and an
  Ondo `Spinner`.
- `MessageScrollerContent` exposes `aria-busy` while the run is active.

When the reader is at the live edge, streaming output remains visible. Once the
reader scrolls away or interacts with earlier content, incoming output must not
pull the viewport back. `MessageScrollerButton` provides the explicit return to
the latest output.

### Complete

- A separator Marker creates the Task complete anchor.
- The final agent `Message` summarizes changes and verification results.
- Generated artifacts use `Attachment state="done"`.
- The Changes inspector represents the same changed files with Ondo `Item`
  rows.
- A failed output uses `Attachment state="error"` with retry and remove
  actions instead of a custom error card.

## Ondo UI dependency map

| Product role          | Ondo UI primitives                                               |
| --------------------- | ---------------------------------------------------------------- |
| Workspace shell       | `Sidebar`, `Resizable`, `Sheet`, `ScrollArea`, `Separator`       |
| Header and navigation | `Heading`, `Breadcrumb`, `Badge`, `DropdownMenu`, `Tooltip`      |
| Conversation          | `Message`, `Bubble`, `MessageScroller`, `Marker`, `Avatar`       |
| Context and outputs   | `Attachment`, `Item`, `Frame`, `Tabs`                            |
| Agent progress        | `Timeline`, `Progress`, `ProgressRing`, `Spinner`, `Collapsible` |
| Prompt and actions    | `InputGroup`, `Button`, `ButtonGroup`, `Tooltip`, `Kbd`          |
| Completion and errors | `Alert`, `Badge`, `Attachment`, `Marker`                         |

`Timeline` communicates chronological agent activity in the inspector. The
Block does not also use `Stepper` for the same information. `Frame` provides
the structured inspector surfaces; redundant generic Card wrappers should not
replace the more specific Ondo primitives.

## Data model

The deterministic fixture uses an ordered event model with stable identifiers:

```ts
type WorkspaceStage = "start" | "running" | "complete"

type WorkspaceEvent =
  | { id: string; kind: "message"; role: "user" | "agent"; text: string }
  | {
      id: string
      kind: "marker"
      milestone: boolean
      label: string
      status: "idle" | "running" | "success" | "error"
    }
  | {
      id: string
      kind: "attachment"
      state: "idle" | "processing" | "done" | "error"
      fileName: string
    }
  | {
      id: string
      kind: "tool"
      status: "pending" | "running" | "success" | "error"
      command: string
    }
```

Each stage selects a prefix of the event list. The conversation renderer maps
event kinds to Ondo primitives, gives every rendered row its event ID as
`messageId`, and sets `scrollAnchor` only for user messages and milestone
markers. Reader Rail destinations are derived from the filtered event list,
not maintained as a second manual list.

No demo timer, AI transport, or server response is required. The fixtures make
the preview deterministic, screenshot-friendly, and usable after registry
installation. Interactive controls may switch stages, expand tool output,
navigate anchors, resize panels, and open mobile Sheets without external state.

## Registry item

The registry entry is named `agent-workspace-01`, has type `registry:block`,
uses categories `ai` and `workspace`, and declares an iframe height suitable
for a full workspace preview. Its page file has an explicit target of
`app/agent-workspace/page.tsx`.

Direct Ondo dependencies use the repository's required namespace, for example:

```json
{
  "name": "agent-workspace-01",
  "type": "registry:block",
  "description": "An agent workspace with conversation, task progress, and artifacts.",
  "dependencies": ["@tabler/icons-react"],
  "registryDependencies": [
    "@ondo-ui/sidebar",
    "@ondo-ui/resizable",
    "@ondo-ui/message",
    "@ondo-ui/bubble",
    "@ondo-ui/message-scroller",
    "@ondo-ui/marker",
    "@ondo-ui/attachment",
    "@ondo-ui/input-group",
    "@ondo-ui/timeline",
    "@ondo-ui/progress",
    "@ondo-ui/progress-ring",
    "@ondo-ui/item",
    "@ondo-ui/frame",
    "@ondo-ui/tabs"
  ],
  "categories": ["ai", "workspace"],
  "meta": { "iframeHeight": "900px" }
}
```

The final dependency list must include every primitive imported directly by
the Block and may be longer than this representative excerpt. Transitive Ondo
dependencies remain owned by their registry items.

The supported installation command is:

```bash
npx shadcn@latest add @ondo-ui/agent-workspace-01
```

The Block does not need to appear in shadcn's no-argument component picker;
explicit registry addresses resolve non-`registry:ui` items.

## Failure behavior

- A failed tool call remains in its related Collapsible with its command,
  concise stderr, and retry action.
- A failed major phase may use an alert icon and destructive semantic styling
  on a Marker. It becomes a Reader Rail anchor only when it changes the task's
  major phase.
- Failed file processing uses the Attachment error state.
- Late-loading attachment media, expanded tool output, and prepended history
  must not move the reader away from the currently visible row.
- Reopening a saved complete fixture lands on the last meaningful user turn,
  not an arbitrary scroll offset or the absolute bottom.
- Missing or not-yet-mounted Reader Rail targets produce no speculative retry
  loop or fallback jump.

## Accessibility

- `MessageScrollerContent` retains its live-log defaults and additions
  announcements.
- Running content uses `aria-busy` without repeatedly announcing token-sized
  fragments.
- Reader Rail destinations use stable accessible names and
  `aria-current="location"`.
- Icon-only controls have explicit labels.
- Informational Marker rows use `role="status"` only when an announcement is
  useful; decorative icons are hidden from assistive technology.
- Tool output remains keyboard-operable through Collapsible triggers.
- Focus stays on the control the user activated when Sheets, HoverCards,
  Popovers, or Collapsibles close.
- Smooth scrolling and animated indicators respect reduced-motion settings.

## Testing and verification

Focused tests cover:

1. Start, running, and complete select the intended prefixes of one event
   fixture.
2. Only user requests and major milestone Markers receive `scrollAnchor`.
3. Every transcript row receives a stable and unique `messageId`.
4. Reader Rail destinations are derived from the visible anchored events.
5. `currentAnchorId` updates the rail's current destination.
6. Selecting a destination calls `scrollToMessage` with the matching ID.
7. Streaming follows only while the reader remains at the live edge; scrolling
   away preserves position and activates the return control.
8. Processing, done, and error file events render the matching Attachment
   states.
9. Desktop Block preview uses the isolated iframe and compact catalog layouts
   use the matching light or dark screenshot.
10. The copied install command contains the `@ondo-ui/` namespace.

Registry verification must confirm that the generated
`public/r/agent-workspace-01.json` and exported equivalent exist, every local
registry dependency resolves, the page target is preserved, and the built item
contains every declared Block file.

Run the repository verification suite:

```bash
bun test
bun run typecheck
bun run build
```

Finally, install the generated item into a temporary compatible project and
verify that this command resolves all files and dependencies without relying
on the Ondo repository's source tree:

```bash
npx shadcn@latest add @ondo-ui/agent-workspace-01
```

## Success criteria

- The `/blocks` page visually follows the official shadcn Block catalog model
  instead of embedding a full application inside the site container.
- The isolated preview has no Ondo site header, footer, or duplicate page
  padding.
- The installed Block presents one coherent task across Start, In progress,
  and Complete states.
- Marker, Message, MessageScroller, Bubble, and Attachment are central to the
  conversation experience rather than decorative examples.
- Reader position behaves like the MessageScroller Tracking the Reader's
  Position demo: it reports the current anchored turn, preserves user intent,
  and supports direct navigation.
- The Block visibly composes the relevant existing Ondo UI primitives and adds
  no replacement primitive under `components/ui/`.
- The namespaced shadcn install succeeds from the generated registry payload.
