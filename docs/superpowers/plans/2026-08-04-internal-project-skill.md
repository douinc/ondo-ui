# Internal Project Skill Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the repository-only `add-component` Skill from normal external discovery while keeping it available to agents working in the Ondo UI repository.

**Architecture:** Use the `skills` CLI's supported `metadata.internal: true` frontmatter marker on `.claude/skills/add-component/SKILL.md`. Protect the behavior with a repository contract test and verify the actual CLI discovery output before updating the existing pull request.

**Tech Stack:** Agent Skills Markdown frontmatter, Bun test, `skills` CLI 1.5.x, Git, GitHub CLI

## Global Constraints

- Keep `.claude/skills/add-component/SKILL.md` in its current location so repository agents and `AGENTS.md` continue to use it.
- Normal `npx skills add douinc/ondo-ui` discovery must expose `ondo-ui` and hide `add-component`.
- Do not change the public `skills/ondo-ui` bundle, npm package contents, registry components, or release behavior.
- Implement the contract test before changing production frontmatter and observe the expected failure.

---

### Task 1: Mark the maintainer Skill as internal

**Files:**
- Modify: `scripts/ondo-skill.test.ts`
- Modify: `.claude/skills/add-component/SKILL.md`

**Interfaces:**
- Consumes: the `skills` CLI frontmatter contract where `metadata.internal === true` excludes a Skill from normal discovery.
- Produces: an internal-only `add-component` Skill that remains readable from its existing repository path.

- [ ] **Step 1: Write the failing contract test**

Add this test to `scripts/ondo-skill.test.ts`:

```ts
test("marks the repository maintainer skill as internal", async () => {
  const maintainerSkill = await readFile(
    resolve(repositoryRoot, ".claude/skills/add-component/SKILL.md"),
    "utf8"
  )

  expect(maintainerSkill).toMatch(/metadata:\s*\n\s+internal: true/)
})
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```bash
bun test scripts/ondo-skill.test.ts
```

Expected: FAIL in `marks the repository maintainer skill as internal` because the `metadata.internal` frontmatter is absent.

- [ ] **Step 3: Add the minimal visibility metadata**

Change the frontmatter in `.claude/skills/add-component/SKILL.md` to:

```yaml
---
name: add-component
description: Add a new component (or composition) to the ondo-ui registry, covering the component file, demos, EN/KO docs, registry entry, the /components gallery listing, and the changelog + version bump. Use this whenever work touches adding, registering, renaming, or removing an ondo-ui registry item -- and also when something already built is mysteriously missing from the docs sidebar, the /components page, or a shadcn install, since that is almost always a missed registration step rather than a bug in the component.
metadata:
  internal: true
---
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
bun test scripts/ondo-skill.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Verify real CLI discovery behavior**

Run:

```bash
npx --yes skills add . --list
```

Expected: `Found 1 skill`, with `ondo-ui` listed and no `add-component` entry.

- [ ] **Step 6: Commit the behavior change**

```bash
git add scripts/ondo-skill.test.ts .claude/skills/add-component/SKILL.md
git commit -m "fix: hide repository maintainer skill"
```

### Task 2: Verify and update the pull request

**Files:**
- Verify only: `packages/ondo-ui-cli/package.json`
- Verify only: pull request branch `feat/ondo-ui-skill`

**Interfaces:**
- Consumes: the committed internal Skill marker from Task 1.
- Produces: a green, synchronized PR #16 with unchanged npm package contents.

- [ ] **Step 1: Run the complete repository verification**

```bash
bun test
bun run typecheck
bun run lint
bun run build
```

Expected: tests, typecheck, and build pass; lint has no errors. Existing unrelated warnings may remain.

- [ ] **Step 2: Verify npm packaging remains unchanged**

Run from `packages/ondo-ui-cli`:

```bash
npm pack --dry-run --json
```

Expected: exactly the existing seven package files are included and neither `.claude/skills/add-component` nor `skills/ondo-ui` is packaged.

- [ ] **Step 3: Verify Git integrity and push the existing branch**

```bash
git diff origin/main...HEAD --check
git status --short --branch
git push
```

Expected: no whitespace errors, a clean working tree, and `origin/feat/ondo-ui-skill` updated.

- [ ] **Step 4: Confirm PR checks**

```bash
gh pr checks 16 --watch --interval 10
```

Expected: `Build static export` passes. The PR remains open and mergeable for user review.
