# Agent Workspace Sidebar Cleanup Design

## Goal

Remove the `Changed files` group from the Agent Workspace Block sidebar so the
navigation stays focused on recent tasks.

## Scope

- Remove the Sidebar group labelled `Changed files` and its file rows.
- Remove Sidebar-only imports that become unused.
- Keep `workspaceFiles` because the Inspector `Changes` tab still renders the
  changed-file summary.
- Keep the Inspector tabs, Registry file list, installation payload, lifecycle
  stages, conversation, Reader Rail, and responsive behavior unchanged.

## Verification

- Add a regression assertion that the rendered sidebar does not contain the
  `Changed files` label or Sidebar file badges.
- Assert that the Inspector still contains its `Changes` tab and file data.
- Regenerate the Block screenshots because the desktop layout visibly changes.
- Run focused tests, typecheck, lint, Registry build, static export verification,
  and the full test suite.
