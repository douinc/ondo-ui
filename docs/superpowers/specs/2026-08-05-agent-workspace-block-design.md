# Agent Workspace Block Design

**Date:** 2026-08-05

## Summary

Add Ondo UI's first Block: `agent-workspace`, a full-screen, three-panel AI
workspace template inspired by the shared interaction model of Codex and Claude
Cowork. The Block is domain-neutral, while its sample scenario follows a product
team asking an agent to analyze and improve an onboarding flow.

The same task is shown in three snapshots—start, running, and complete—so users
can see the full delegation-to-deliverable lifecycle without connecting an AI
backend. The `/blocks` page will replace its coming-soon placeholder with an
interactive preview and install command.

## Goals

- Ship one installable `registry:block` named `agent-workspace`.
- Provide a full-viewport application shell assembled from existing Ondo UI
  registry components.
- Present project/task navigation, an agent conversation and activity stream,
  and a file/deliverable review panel in one coherent layout.
- Show start, running, and complete snapshots of the same onboarding-improvement
  task.
- Make the preview interactive using local, typed fixture data only.
- Support desktop, tablet, and mobile layouts plus light and dark themes.
- Give adopters clear integration seams for real task, message, and artifact
  data without turning the Block into a general-purpose framework.

## Non-goals

- No AI SDK transport, streaming endpoint, model picker, or provider setup.
- No real filesystem, repository, diff editor, persistence, authentication, or
  scheduled task integration.
- No automatic timers that move the task between lifecycle states.
- No new primitive under `components/ui/`.
- No dedicated Block detail or full-screen preview route in the first release.
- No attempt to reproduce OpenAI or Anthropic branding or product chrome.

## Product Model

The design combines two current agent-workspace patterns:

- Codex organizes agent threads by project and makes progress and changes
  reviewable in the task thread.
- Cowork starts from a goal, works across provided context, and returns finished
  deliverables.

The resulting Ondo pattern is:

1. Choose or create a task and provide its context.
2. Follow the agent's conversation, plan, and tool activity.
3. Review files, evidence, and finished deliverables.

Reference material:

- <https://openai.com/index/introducing-the-codex-app/>
- <https://www.anthropic.com/product/claude-cowork>

## Distribution and File Structure

The source Block is split by responsibility but distributed as one registry
item:

```text
components/blocks/agent-workspace/
├── agent-workspace.tsx
├── workspace-sidebar.tsx
├── workspace-thread.tsx
├── workspace-artifacts.tsx
└── workspace-data.ts
```

Responsibilities:

- `agent-workspace.tsx` is the client-side composition root. It owns panel and
  selection state, resolves controlled versus uncontrolled status, and arranges
  the responsive shell.
- `workspace-sidebar.tsx` renders the workspace identity, new-task action,
  projects, tasks, statuses, and user menu.
- `workspace-thread.tsx` renders the task header, messages, plan/activity rows,
  completion summary, and composer.
- `workspace-artifacts.tsx` renders context files, current progress, changed
  files, completed deliverables, and mobile panel triggers.
- `workspace-data.ts` defines the status and snapshot types and exports the
  local onboarding fixtures.

Site-only integration remains outside the registry source:

```text
components/block-previews/agent-workspace-preview.tsx
lib/blocks-list.ts
app/_shared/pages/blocks-page.tsx
lib/dictionaries.ts
registry.json
```

`agent-workspace-preview.tsx` owns the start/running/complete preview tabs. Those
tabs are documentation controls and do not appear inside the installed product
screen.

## Registry Contract

`registry.json` will contain an item with:

- name `agent-workspace`;
- type `registry:block`;
- all five Block source files;
- every directly imported Ondo item declared as an
  `@ondo-ui/<dependency>` registry dependency;
- `@tabler/icons-react` as an npm dependency for the Block's interface icons.

The install command is:

```bash
bunx shadcn@latest add @ondo-ui/agent-workspace
```

The install must resolve every transitive registry dependency and place the
Block under the consumer's configured components alias.

Following shadcn's Block convention, `agent-workspace` is an explicit-name
install target. It does not appear in the component picker opened by an
argument-free `add`, and it is not included in `--all`. Discovery happens on
the `/blocks` gallery; installation happens through the namespaced command
above (or the equivalent explicit `ondo-ui add agent-workspace` wrapper).

## Public Component Contract

The Block is source-first: consumers are expected to edit its copied files.
Only the lifecycle state needs a small reusable contract:

```ts
type WorkspaceStatus = "start" | "running" | "complete"

type AgentWorkspaceProps = React.ComponentProps<"div"> & {
  status?: WorkspaceStatus
  defaultStatus?: WorkspaceStatus
  onStatusChange?: (status: WorkspaceStatus) => void
}
```

- `status` makes the lifecycle controlled.
- `defaultStatus` selects the initial local snapshot when `status` is omitted.
- `onStatusChange` reports lifecycle changes requested by Block controls, such
  as the new-task action. A controlled host decides whether to accept them.
- Standard `div` props, including `className`, support preview sizing and local
  customization.

The default status is `start`. The Block does not advance itself on a timer.
The preview wrapper controls all three snapshots explicitly. Consumers replace
the fixture selection boundary with their own application state when wiring a
backend.

## Layout

### Desktop

At `xl` and above, the Block shows all three panels:

- a `16rem` left task sidebar;
- a flexible central task thread;
- a `20rem` right context and deliverables panel.

The Block uses `min-h-svh` by default. The `/blocks` preview passes a bounded
height and `min-h-0` override so the same component fits inside the gallery.

### Tablet

From `md` through `lg`, the left sidebar remains visible in its icon-collapsible
mode, the central thread gets the remaining width, and the right panel opens in
a Sheet from a labeled header action.

### Mobile

Below `md`, the central thread fills the viewport. The task sidebar and artifact
panel each open in a Sheet. Closing a Sheet returns focus to its trigger.

## Lifecycle Snapshots

All three snapshots use the same product-improvement scenario and stable task
identity.

### Start

- The center presents a concise welcome state and a composer prefilled with the
  example goal: analyze the onboarding flow and implement an improvement.
- Context chips suggest common ways to frame the work.
- The right panel shows the selected Product Experience project and attached
  design, funnel-data, and research files.

### Running

- The user's goal appears in the thread followed by an agent progress update.
- A collapsible plan shows completed, current, and queued stages.
- The right panel shows numeric progress, the current action, and files being
  changed.
- The composer remains available for a corrective follow-up.

### Complete

- The thread shows a completion summary, key outcome metrics, and verification
  evidence.
- The right panel lists the prototype, analysis report, and implementation plan
  as finished deliverables.
- The composer invites revision or a follow-up task.

## Local Data Model

`workspace-data.ts` exports a `WorkspaceSnapshot` for each status. A snapshot
contains:

- workspace and project identity;
- task list and selected task ID;
- message and activity items;
- plan steps with stable IDs and statuses;
- context files, changed files, and deliverables;
- progress value and completion summary where applicable.

Selectors accept a requested ID and fall back to the first available item. They
return `undefined` for an empty collection so the consuming panel can render an
intentional empty state instead of throwing.

## Interactions

The mock implementation supports:

- creating or returning to a start-state task;
- selecting projects and tasks;
- collapsing the desktop sidebar and opening both mobile Sheets;
- selecting a context file or deliverable;
- expanding and collapsing the activity plan;
- entering and locally submitting a non-empty message;
- changing snapshots through the site-only preview tabs.

Submitting a mock message appends a local user entry and clears the composer. It
does not fabricate an assistant response or change lifecycle status. Host code
uses `status` and responds to `onStatusChange` when connecting the same UI to a
real agent.

## Blocks Gallery

`lib/blocks-list.ts` becomes the single metadata list for Block cards and
registry parity checks. Its first entry is `agent-workspace`, with English and
Korean descriptions.

The shared `/blocks` page will:

1. retain its localized heading and description;
2. remove the coming-soon placeholder;
3. render the Block title, description, and copyable install command;
4. render start/running/complete Tabs above a bounded live preview;
5. use the same shared page for English and Korean routes.

The Block's mock product content remains Korean in both locale variants for this
first release. The gallery chrome and metadata are localized. This avoids
shipping two divergent fixture sets while still demonstrating the Korean-first
Ondo product tone.

## Empty and Invalid States

- An empty task collection renders a central new-task prompt.
- Empty file and deliverable collections render compact Empty states in the
  right panel.
- The composer disables submission after trimming an empty value.
- A missing selected task or artifact ID falls back to the first available
  entry.
- A completely empty collection never produces an invalid array access.
- TypeScript restricts lifecycle values to the three supported statuses.

There is no remote failure view because the Block performs no I/O. Consumers
adding I/O should map their loading and error states at the snapshot boundary.

## Accessibility

- The three regions use semantic navigation, main, and complementary landmarks
  with accessible labels.
- The thread uses `role="log"` and appropriate live-region behavior for appended
  messages.
- Progress uses native or equivalent progress semantics with a numeric value and
  text label.
- Status is always expressed through text or an icon as well as color.
- Every icon-only action has an accessible name and visible tooltip where the
  action is not otherwise obvious.
- Keyboard users can reach every task, artifact, composer action, and Sheet
  trigger.
- Sheet close behavior restores trigger focus.
- Animations honor `prefers-reduced-motion`; no state changes happen solely
  through animation.

## Verification

Automated checks will cover:

- status-to-snapshot selection and missing-ID fallbacks;
- parity between `blocksList` and `registry:block` items;
- the `agent-workspace` registry payload and namespaced Ondo dependencies;
- English and Korean `/blocks` static output;
- TypeScript, ESLint, Bun tests, registry build, Next build, and static-export
  verification.

Required commands:

```bash
bun run typecheck
bun run lint
bun test
bun run build
```

Manual browser verification covers:

- all three snapshots;
- desktop, tablet, and mobile panel behavior;
- keyboard focus and Sheet focus restoration;
- light and dark themes;
- bounded gallery preview versus default full-viewport rendering.

## Acceptance Criteria

1. `/blocks` no longer shows a coming-soon placeholder and displays the first
   Block in English and Korean routes.
2. The preview switches between start, running, and complete snapshots of the
   same onboarding-improvement task.
3. Desktop shows three panels, tablet moves the right panel into a Sheet, and
   mobile moves both side panels into Sheets.
4. The Block works without network access and has no automatic lifecycle timer.
5. `bunx shadcn@latest add @ondo-ui/agent-workspace` installs every required file
   and Ondo dependency, while the argument-free picker and `--all` continue to
   omit Blocks.
6. Empty selections and empty collections render intentional fallback UI rather
   than throwing.
7. Status, progress, controls, and responsive panels are keyboard and screen
   reader accessible.
8. Type checking, linting, tests, registry generation, the Next build, and
   static-export verification pass.
