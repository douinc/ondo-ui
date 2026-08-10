---
"@dou.so/ondo-ui": patch
---

`init` now replaces template-created stock components (for example the Next.js template's Radix-based `button.tsx`) with their `@ondo-ui` counterparts, so a fresh project typechecks cleanly after `add --all`. Files that existed before `init` ran are never touched.
