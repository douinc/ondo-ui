# Internal Project Skill Design

## Context

Ondo UI publishes the installable `skills/ondo-ui` Skill from the repository. The same repository also contains `.claude/skills/add-component`, which is a maintainer workflow used only while working inside the Ondo UI source repository.

The `skills` CLI scans `.claude/skills/` as a standard discovery location. Because `add-component` currently has no visibility metadata, `npx skills add douinc/ondo-ui` offers both `ondo-ui` and `add-component` to external users.

## Goal

Keep `add-component` available to agents working in the Ondo UI repository while exposing only `ondo-ui` during normal external Skill discovery and installation.

## Decision

Add the supported internal marker to `.claude/skills/add-component/SKILL.md`:

```yaml
metadata:
  internal: true
```

The `skills` CLI excludes Skills with this metadata from normal discovery. Maintainers can still opt into internal discovery with `INSTALL_INTERNAL_SKILLS=1`, and repository agents can continue reading the existing file through `AGENTS.md` and native project Skill support.

## Alternatives considered

### Move the maintainer guide outside `.claude/skills`

This would prevent CLI discovery but could also remove native project Skill behavior for Claude-compatible agents. It would require updating repository instructions and creates unnecessary compatibility risk.

### Move the maintainer Skill to another repository

This separates public and private concerns completely, but makes the component workflow harder to version alongside the registry conventions it documents. The operational overhead is not justified for one repository-local Skill.

### Add `metadata.internal: true` — selected

This uses the visibility mechanism provided by the current `skills` CLI, preserves the existing project layout, and changes only discovery behavior.

## Testing

Add a repository contract test that verifies the `add-component` frontmatter contains `metadata.internal: true`. Run that test before the metadata change to confirm it fails, then apply the metadata and confirm it passes.

Finally, run `npx --yes skills add . --list` and verify that normal discovery lists `ondo-ui` but not `add-component`. Run the existing test, typecheck, lint, build, and packaging checks before updating the pull request.

## Scope

This change does not alter the public `ondo-ui` Skill, npm package contents, component registry, or release behavior. It only changes whether the repository-maintainer Skill appears in normal external Skill discovery.
