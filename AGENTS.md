<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Adding or changing a registry component

**Read `.claude/skills/add-component/SKILL.md` before adding, renaming, or
removing anything under `components/ui/`** — and also when a component you
already built is missing from the docs sidebar, the `/components` page, or a
`shadcn add` install.

A component is not "added" by creating its `.tsx` file. It has to be registered
in seven hand-maintained places, and **each one fails silently** — the build
passes and the component just never appears. That file lists all seven, explains
the repo's component/docs/registry conventions, and describes the release steps.

To check your work at any point:

```bash
python3 .claude/skills/add-component/scripts/check-registration.py <name>
npm run build
```

The checker is plain Python with no dependencies, and the skill file is plain
Markdown — both work with any coding agent, not just Claude.
