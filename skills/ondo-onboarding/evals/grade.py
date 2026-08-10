#!/usr/bin/env python3
"""Programmatic grader for ondo-onboarding eval runs.

Usage: python3 grade.py <eval_name> <run_dir>
Writes <run_dir>/grading.json with {"expectations": [{"text", "passed", "evidence"}]}.
"""

import json
import os
import re
import sys

REGISTRY_URL = "https://ui.ondo.dou.so/r/{name}.json"
GUARD_TOKENS = ["NODE_ENV", "import.meta.env.DEV", "import.meta.env.PROD"]


def find_dirs(root, suffix):
    hits = []
    for dirpath, dirnames, _ in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".git")]
        norm = dirpath.replace("\\", "/")
        if norm.endswith(suffix):
            hits.append(dirpath)
    return hits


def find_files(root, name):
    hits = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".git")]
        for f in filenames:
            if f == name:
                hits.append(os.path.join(dirpath, f))
    return hits


def read(path):
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            return fh.read()
    except OSError:
        return ""


def load_json(path):
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, json.JSONDecodeError):
        return None


def grep_tree(root, needle):
    """Return (path, line) pairs for files containing needle (source files only)."""
    hits = []
    exts = (".tsx", ".ts", ".jsx", ".js", ".astro", ".mjs")
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".git")]
        for f in filenames:
            if not f.endswith(exts):
                continue
            p = os.path.join(dirpath, f)
            text = read(p)
            if needle in text:
                for i, line in enumerate(text.splitlines(), 1):
                    if needle in line:
                        hits.append((p, i, line.strip()))
                        break
    return hits


def rel(path, base):
    return os.path.relpath(path, base)


def grade(eval_name, run_dir):
    outputs = os.path.join(run_dir, "outputs")
    project = os.path.join(outputs, "project")
    summary = load_json(os.path.join(outputs, "summary.json")) or {}
    setup_log = read(os.path.join(outputs, "setup-log.md"))
    expectations = []

    def add(text, passed, evidence):
        expectations.append({"text": text, "passed": bool(passed), "evidence": evidence})

    has_project = os.path.isdir(project)

    # --- Eval-specific: project identity -----------------------------------
    pkg = load_json(os.path.join(project, "package.json")) or {}
    deps = {**(pkg.get("dependencies") or {}), **(pkg.get("devDependencies") or {})}

    if eval_name == "new-next-bun":
        is_next = "next" in deps
        named = pkg.get("name") == "ondo-playground"
        bun_lock = any(
            os.path.exists(os.path.join(project, f)) for f in ("bun.lock", "bun.lockb")
        )
        add(
            "Next.js app 'ondo-playground' scaffolded with a bun lockfile",
            has_project and is_next and named and bun_lock,
            f"next dep: {is_next}, package name: {pkg.get('name')!r}, bun lockfile: {bun_lock}",
        )
    elif eval_name == "existing-vite-pnpm":
        vite_cfg = os.path.exists(os.path.join(project, "vite.config.ts"))
        is_vite = "vite" in deps
        add(
            "Existing Vite app preserved (vite.config.ts intact, no re-scaffold)",
            has_project and vite_cfg and is_vite,
            f"vite.config.ts: {vite_cfg}, vite dep: {is_vite}",
        )
        stray = [
            f
            for f in ("bun.lock", "bun.lockb", "package-lock.json", "yarn.lock")
            if os.path.exists(os.path.join(project, f))
        ]
        pnpm_lock = os.path.exists(os.path.join(project, "pnpm-lock.yaml"))
        add(
            "pnpm stays the only package manager (pnpm-lock.yaml kept, no stray lockfiles)",
            pnpm_lock and not stray,
            f"pnpm-lock.yaml: {pnpm_lock}, stray lockfiles: {stray or 'none'}",
        )

    # --- Registry mapping ---------------------------------------------------
    cj_hits = find_files(project, "components.json") if has_project else []
    mapped = []
    for cj in cj_hits:
        data = load_json(cj) or {}
        if (data.get("registries") or {}).get("@ondo-ui") == REGISTRY_URL:
            mapped.append(rel(cj, project))
    add(
        "components.json registers the @ondo-ui registry URL",
        bool(mapped),
        f"mapped in: {mapped}" if mapped else f"components.json found: {[rel(c, project) for c in cj_hits]}, none maps @ondo-ui",
    )

    # --- Components / Compositions -----------------------------------------
    ui_dirs = find_dirs(project, "components/ui") if has_project else []
    ui_count = sum(
        len([f for f in os.listdir(d) if f.endswith((".tsx", ".ts"))]) for d in ui_dirs
    )
    add(
        "At least 60 component files installed under components/ui",
        ui_count >= 60,
        f"{ui_count} files in {[rel(d, project) for d in ui_dirs] or 'no components/ui dir'}",
    )

    comp_dirs = find_dirs(project, "components/compositions") if has_project else []
    comp_count = sum(
        len([f for f in os.listdir(d) if f.endswith((".tsx", ".ts"))]) for d in comp_dirs
    )
    add(
        "Compositions installed under components/compositions",
        comp_count >= 1,
        f"{comp_count} files in {[rel(d, project) for d in comp_dirs] or 'no compositions dir'}",
    )

    # --- Design Inspector ---------------------------------------------------
    dev_deps = pkg.get("devDependencies") or {}
    add(
        "@dou.so/design-inspector added as a devDependency",
        "@dou.so/design-inspector" in dev_deps,
        f"devDependencies keys: {sorted(dev_deps)[:12]}",
    )

    style_hits = grep_tree(project, "@dou.so/design-inspector/styles.css") if has_project else []
    add(
        "Design Inspector mount imports the package styles.css",
        bool(style_hits),
        "; ".join(f"{rel(p, project)}:{n}" for p, n, _ in style_hits[:3]) or "no file imports styles.css",
    )

    di_files = grep_tree(project, "DesignInspector") if has_project else []
    guarded = []
    for p, _, _ in {(p, 0, 0) for p, _, _ in di_files}:
        text = read(p)
        if any(tok in text for tok in GUARD_TOKENS):
            guarded.append(rel(p, project))
    add(
        "Design Inspector mounted behind a dev-only guard",
        bool(guarded),
        f"guarded in: {guarded}" if guarded else f"DesignInspector referenced in {[rel(p, project) for p, _, _ in di_files]} without a dev guard",
    )

    # --- Component authenticity ---------------------------------------------
    button_paths = [os.path.join(d, "button.tsx") for d in ui_dirs]
    button_src = next((read(p) for p in button_paths if os.path.exists(p)), "")
    add(
        "Installed button.tsx is Ondo's Base UI button (imports @base-ui/react/button)",
        "@base-ui/react/button" in button_src,
        "imports @base-ui/react/button" if "@base-ui/react/button" in button_src
        else ("button.tsx present but not the Ondo source (stock or hand-patched)" if button_src else "no button.tsx installed"),
    )

    # --- MCP ----------------------------------------------------------------
    mcp = load_json(os.path.join(project, ".mcp.json")) or {}
    servers = mcp.get("mcpServers") or {}
    shadcn_server = "shadcn" in json.dumps(mcp).lower()
    add(
        ".mcp.json configures the shadcn MCP server for claude",
        bool(servers) and shadcn_server,
        f"servers: {list(servers) or 'no .mcp.json / empty'}",
    )

    # --- Skills -------------------------------------------------------------
    skill_entries = []
    skills_dir = os.path.join(project, ".claude", "skills")
    if os.path.isdir(skills_dir):
        skill_entries = sorted(os.listdir(skills_dir))
    ondo_skill = any("ondo" in e for e in skill_entries)
    add(
        "Ondo Skill installed project-level under .claude/skills",
        ondo_skill,
        f".claude/skills entries: {skill_entries or 'missing'}",
    )

    # --- Verification evidence ---------------------------------------------
    verify_text = str(summary.get("verify", ""))
    ok_re = re.compile(r"pass|succe|clean|no error|0 error|\bok\b", re.IGNORECASE)
    # Strip success idioms that contain the word "error" before scanning for failures.
    scrubbed = re.sub(r"(no|0|zero)\s+errors?|errors?:\s*0", "", verify_text, flags=re.IGNORECASE)
    fail_re = re.compile(r"fail|error|not run|skip", re.IGNORECASE)
    verify_ok = bool(ok_re.search(verify_text)) and not fail_re.search(scrubbed)
    if not verify_text:
        log_ok = bool(re.search(r"(tsc|typecheck|astro check|build)[^\n]*(pass|succe|clean|no error|exit 0)", setup_log, re.IGNORECASE))
        verify_ok = log_ok
        verify_text = "(from setup-log.md)" if log_ok else "(no verify evidence)"
    add(
        "Typecheck/build verification recorded as passing",
        verify_ok,
        f"summary.verify: {verify_text!r}",
    )

    passed = sum(1 for e in expectations if e["passed"])
    total = len(expectations)
    return {
        "summary": {
            "pass_rate": round(passed / total, 4) if total else 0.0,
            "passed": passed,
            "failed": total - passed,
            "total": total,
        },
        "expectations": expectations,
    }


def main():
    eval_name, run_dir = sys.argv[1], sys.argv[2]
    result = grade(eval_name, run_dir)
    out = os.path.join(run_dir, "grading.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(result, fh, indent=2)
    passed = sum(1 for e in result["expectations"] if e["passed"])
    print(f"{eval_name} {os.path.basename(run_dir)}: {passed}/{len(result['expectations'])} passed -> {out}")


if __name__ == "__main__":
    main()
