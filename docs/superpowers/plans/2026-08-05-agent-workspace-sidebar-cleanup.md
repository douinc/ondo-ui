# Agent Workspace Sidebar Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the `Changed files` group from the Agent Workspace sidebar while preserving the Inspector `Changes` tab.

**Architecture:** Delete only the Sidebar presentation of `workspaceFiles`. Keep the shared fixture and ArtifactPanel consumption intact, then regenerate the published screenshots so the catalog matches the installed Block.

**Tech Stack:** React 19, Next.js 16.2.11, Bun tests, Ondo UI Sidebar/Item primitives, Puppeteer capture.

## Global Constraints

- Do not change anything under `components/ui/`.
- Remove only the Sidebar group labelled `Changed files` and its file rows.
- Keep `workspaceFiles` and the Inspector `Changes` tab unchanged.
- Keep the Registry file list and install surface unchanged.

---

### Task 1: Remove Sidebar changed-file navigation

**Files:**

- Modify: `components/blocks/agent-workspace-01/page.test.tsx`
- Modify: `components/blocks/agent-workspace-01/components/agent-sidebar.tsx`
- Modify: `public/r/styles/base-vega/agent-workspace-01-light.png`
- Modify: `public/r/styles/base-vega/agent-workspace-01-dark.png`

**Interfaces:**

- Consumes: `workspaceFiles` in `artifact-panel.tsx`; this consumption remains unchanged.
- Produces: an Agent Workspace Sidebar containing `Recent tasks` but no `Changed files` group.

- [ ] **Step 1: Write the failing render assertion**

Add this test to `components/blocks/agent-workspace-01/page.test.tsx`:

```tsx
test("keeps changed files in the inspector but not the sidebar", () => {
  const html = renderToStaticMarkup(<AgentWorkspaceBlock />)

  expect(html).not.toContain("Changed files")
  expect(html).toContain('value="changes"')
  expect(html).toContain("page.tsx")
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
bun test components/blocks/agent-workspace-01/page.test.tsx --test-name-pattern "keeps changed files"
```

Expected: FAIL because the Sidebar still renders `Changed files`.

- [ ] **Step 3: Remove the Sidebar group**

In `agent-sidebar.tsx`:

- remove `workspaceFiles` from the fixture import;
- remove `IconFileCode`;
- remove the complete `SidebarGroup` whose label is `Changed files`;
- keep the `Recent tasks` group and both Dropdown menus unchanged.

- [ ] **Step 4: Run focused and adjacent tests**

Run:

```bash
bun test components/blocks/agent-workspace-01/page.test.tsx components/blocks/agent-workspace-01/data.test.ts components/blocks/agent-workspace-01/components/conversation-panel.test.tsx
bun run typecheck
bunx eslint components/blocks/agent-workspace-01/components/agent-sidebar.tsx components/blocks/agent-workspace-01/page.test.tsx
```

Expected: all tests pass, typecheck succeeds, and ESLint reports no errors.

- [ ] **Step 5: Regenerate and inspect screenshots**

Serve the app and run:

```bash
bun run blocks:capture --force
```

Expected: both 1440×900 captures show only `Recent tasks` in the Sidebar. The Inspector still shows Context/Changes/Artifacts.

- [ ] **Step 6: Verify delivery contracts**

Run:

```bash
bun test
bun run typecheck
bun run lint
bun run build
```

Expected: the full suite, Registry build, static export, and screenshot-path checks pass.

- [ ] **Step 7: Commit**

```bash
git add components/blocks/agent-workspace-01/components/agent-sidebar.tsx components/blocks/agent-workspace-01/page.test.tsx
git add -f public/r/styles/base-vega/agent-workspace-01-light.png public/r/styles/base-vega/agent-workspace-01-dark.png
git commit -m "refactor: simplify agent workspace sidebar"
```
