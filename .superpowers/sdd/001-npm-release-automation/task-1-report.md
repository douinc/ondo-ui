# Task 1 Report — isolate CLI package

## Status

DONE

## Summary

Implemented the first npm release automation step by moving the canonical npm CLI publishing surface into `packages/ondo-ui-cli` while making the repository root private and non-publishable.

## Changes made

- Marked the root site package as `"private": true`.
- Removed root npm publish metadata from `package.json`:
  - `name`
  - `version`
  - `publishConfig`
  - `bin`
  - `files`
- Created `packages/ondo-ui-cli/package.json` for the independently publishable CLI package:
  - `name`: `@dou.so/ondo-ui`
  - `version`: `1.3.1`
  - public publish access
  - `ondo-ui` bin command
  - repository metadata for `https://github.com/douinc/ondo-ui`
  - homepage: `https://ui.ondo.dou.so`
  - narrow `files` allowlist for only the package metadata, CLI bin, and READMEs
  - package-level `pack:dry-run` script
- Copied the canonical package files into `packages/ondo-ui-cli`:
  - `bin/ondo-ui.mjs`
  - `README.md`
  - `README_KO.md`
- Updated `scripts/ondo-cli.test.ts` to import and exercise the CLI from `packages/ondo-ui-cli/bin/ondo-ui.mjs`, including the package-manager symlink direct-invocation behavior.

## Verification

- Baseline before implementation:
  - `bun test scripts/ondo-cli.test.ts`
  - Result: 8 pass, 0 fail
- TDD red check:
  - Updated the regression test to import `../packages/ondo-ui-cli/bin/ondo-ui.mjs` before creating the package.
  - Result: failed with `Cannot find module '../packages/ondo-ui-cli/bin/ondo-ui.mjs'`, as expected.
- Focused CLI regression test after implementation:
  - `bun test scripts/ondo-cli.test.ts`
  - Result: 8 pass, 0 fail
- Package dry-run inspection:
  - `bun run --cwd packages/ondo-ui-cli pack:dry-run`
  - Result: tarball contains exactly 4 files:
    - `package.json`
    - `bin/ondo-ui.mjs`
    - `README.md`
    - `README_KO.md`
  - No documentation site dependencies were included.
- Preservation checks:
  - `components.json` was not modified in the isolated worktree.
  - No Changesets files or workflow files were added.
  - The CLI and README copies match the root originals exactly.

## Concerns

None.
