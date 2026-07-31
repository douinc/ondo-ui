#!/usr/bin/env python3
"""Check that every documented component is registered everywhere it needs to be.

A component in this repo is not "added" once its .tsx file exists -- it has to be
listed in several hand-maintained places, and missing any one of them fails
silently (no build error, the component just never appears). This script makes
those silent failures loud.

Usage:
    python3 .claude/skills/add-component/scripts/check-registration.py            # all components
    python3 .claude/skills/add-component/scripts/check-registration.py heading    # one component

Exit code is 0 when everything lines up, 1 when something is missing.
Run it from the repository root.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path.cwd()

DOCS_DIR = ROOT / "content/docs/components"
DEMOS_DIR = ROOT / "components/demos"
UI_DIR = ROOT / "components/ui"
DEMOS_INDEX = DEMOS_DIR / "index.tsx"
COMPONENTS_LIST = ROOT / "lib/components-list.ts"
REGISTRY = ROOT / "registry.json"
META = DOCS_DIR / "meta.json"

# <ComponentPreview name="x"> ... ```tsx <code> ``` ... </ComponentPreview>
PREVIEW_RE = re.compile(
    r'<ComponentPreview name="([a-z0-9-]+)">\s*```tsx\n(.*?)\n```\s*</ComponentPreview>',
    re.S,
)
EXPORT_RE = re.compile(r"export default function (\w+)")

failures: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


def missing_paths() -> list[str]:
    """Guard against being run from the wrong directory."""
    required = [DOCS_DIR, DEMOS_INDEX, COMPONENTS_LIST, REGISTRY, META]
    return [str(p.relative_to(ROOT)) for p in required if not p.exists()]


def documented_components() -> list[str]:
    """English docs pages are the canonical list of documented components."""
    return sorted(
        p.stem
        for p in DOCS_DIR.glob("*.mdx")
        if not p.name.endswith(".ko.mdx") and p.stem != "index"
    )


def check_global(names: list[str], all_documented: list[str]) -> None:
    meta_pages = set(json.loads(META.read_text())["pages"])
    list_names = set(re.findall(r'name: "([a-z0-9-]+)"', COMPONENTS_LIST.read_text()))
    registry_items = json.loads(REGISTRY.read_text())["items"]
    registry_ui = {i["name"] for i in registry_items if i.get("type") == "registry:ui"}
    registry_files = {
        i["name"]: {f["path"] for f in i.get("files", [])} for i in registry_items
    }

    for name in names:
        if name not in meta_pages:
            fail(f'{name}: missing from content/docs/components/meta.json "pages"')
        if name not in list_names:
            fail(f"{name}: missing from lib/components-list.ts (breaks the /components gallery)")
        if name not in registry_ui:
            fail(f'{name}: no registry.json item of type "registry:ui"')
        else:
            expected = f"components/ui/{name}.tsx"
            if expected not in registry_files.get(name, set()):
                fail(f"{name}: registry.json item does not list {expected}")
        if not (UI_DIR / f"{name}.tsx").exists():
            fail(f"{name}: components/ui/{name}.tsx does not exist")
        if not (DOCS_DIR / f"{name}.ko.mdx").exists():
            fail(f"{name}: missing Korean docs page {name}.ko.mdx")

    # Entries pointing at docs that don't exist are drift in the other direction.
    for stale in sorted(list_names - set(all_documented)):
        fail(f"{stale}: listed in lib/components-list.ts but has no docs page")
    for stale in sorted(meta_pages - set(all_documented)):
        fail(f"{stale}: listed in meta.json but has no docs page")

    undocumented = sorted(registry_ui - set(all_documented))
    if undocumented:
        notes.append(
            "registry:ui items without docs pages (fine if intentionally internal): "
            + ", ".join(undocumented)
        )


def check_demos(names: list[str]) -> None:
    """Every demo a docs page previews must exist and be registered.

    A <ComponentPreview name="x"> renders whatever components/demos/index.tsx maps
    "x" to, so an unregistered or misnamed demo renders nothing -- with no build
    error to tell you. That is the failure this catches.

    The fenced code beside the preview is deliberately NOT compared byte-for-byte:
    English pages often abridge a long demo to stay readable, and Korean pages
    translate the user-visible copy. Both are intentional. What must still hold is
    that the block shows the *same component* it claims to -- so we compare the
    default export name instead.
    """
    index_src = DEMOS_INDEX.read_text()
    registered = set(re.findall(r'"([a-z0-9-]+)":\s*\w+,', index_src))

    for name in names:
        for locale_suffix in ("", ".ko"):
            doc = DOCS_DIR / f"{name}{locale_suffix}.mdx"
            if not doc.exists():
                continue
            label = doc.name
            for demo_name, block in PREVIEW_RE.findall(doc.read_text()):
                demo_file = DEMOS_DIR / f"{demo_name}.tsx"
                if not demo_file.exists():
                    fail(f"{label}: previews {demo_name} but components/demos/{demo_name}.tsx is missing")
                    continue
                if demo_name not in registered:
                    fail(f"{label}: {demo_name} is not registered in components/demos/index.tsx")
                in_file = EXPORT_RE.search(demo_file.read_text())
                in_doc = EXPORT_RE.search(block)
                if in_file and in_doc and in_file.group(1) != in_doc.group(1):
                    fail(
                        f"{label}: the code block beside {demo_name} defines "
                        f"{in_doc.group(1)}(), but the demo file defines {in_file.group(1)}()"
                    )


def main() -> int:
    stray = missing_paths()
    if stray:
        print("Run this from the repository root; could not find: " + ", ".join(stray))
        return 1

    all_documented = documented_components()
    requested = sys.argv[1:]

    if requested:
        unknown = [n for n in requested if n not in all_documented]
        if unknown:
            print(f"No docs page for: {', '.join(unknown)}")
            print("(A component is only checkable once content/docs/components/<name>.mdx exists.)")
            return 1
        names = requested
    else:
        names = all_documented

    check_global(names, all_documented)
    check_demos(names)

    scope = ", ".join(requested) if requested else f"all {len(names)} documented components"
    if failures:
        print(f"FAIL ({scope}) -- {len(failures)} problem(s):\n")
        for f in failures:
            print(f"  - {f}")
        if notes:
            print()
            for n in notes:
                print(f"  note: {n}")
        return 1

    print(f"OK -- {scope} registered consistently.")
    for n in notes:
        print(f"note: {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
