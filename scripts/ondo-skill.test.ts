import { describe, expect, test } from "bun:test"
import { access, readFile } from "node:fs/promises"
import { dirname, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const skillRoot = resolve(repositoryRoot, "skills/ondo-ui")

const requiredFiles = [
  "SKILL.md",
  "cli.md",
  "customization.md",
  "mcp.md",
  "registry.md",
  "agents/openai.yml",
  "assets/ondo-small.png",
  "assets/ondo.png",
  "evals/evals.json",
  "rules/base-ui.md",
  "rules/chat.md",
  "rules/composition.md",
  "rules/forms.md",
  "rules/icons.md",
  "rules/styling.md",
]

const ruleFiles = requiredFiles.filter((file) => file.startsWith("rules/"))

describe("Ondo UI skill contract", () => {
  test("ships every required skill file", async () => {
    await Promise.all(
      requiredFiles.map((file) => access(resolve(skillRoot, file)))
    )
  })

  test("keeps the GitHub-hosted skill out of the npm package", async () => {
    const packageJson = JSON.parse(
      await readFile(
        resolve(repositoryRoot, "packages/ondo-ui-cli/package.json"),
        "utf8"
      )
    ) as { files?: string[] }

    expect(packageJson.files).toBeArray()
    expect(packageJson.files).toContain("bin/ondo-docs.mjs")
    expect(packageJson.files?.some((file) => file.startsWith("skills"))).toBe(
      false
    )
  })

  test("declares the Ondo CLI boundary and project context", async () => {
    const skill = await readFile(resolve(skillRoot, "SKILL.md"), "utf8")

    expect(skill).toContain("name: ondo-ui")
    expect(skill).toContain("@dou.so/ondo-ui@latest info --json")
    expect(skill).toContain(
      "allowed-tools: Bash(bunx --bun @dou.so/ondo-ui@latest *)"
    )
    expect(skill).not.toMatch(/Correct \(radix\)|Correct \(aria\)/i)
  })

  test("links every primary reference from the main skill", async () => {
    const skill = await readFile(resolve(skillRoot, "SKILL.md"), "utf8")
    const links = [...skill.matchAll(/\]\((\.\/[^)]+)\)/g)].map(
      (match) => match[1]
    )

    expect(links).toEqual(
      expect.arrayContaining([
        "./cli.md",
        "./customization.md",
        "./mcp.md",
        "./registry.md",
      ])
    )

    for (const link of links) {
      const path = resolve(skillRoot, link.split("#")[0])
      expect(path.startsWith(`${skillRoot}${sep}`)).toBe(true)
      await access(path)
    }
  })

  test("keeps rule examples on the Base UI contract", async () => {
    const ruleText = (
      await Promise.all(
        ruleFiles.map((file) => readFile(resolve(skillRoot, file), "utf8"))
      )
    ).join("\n")

    expect(ruleText).not.toMatch(/Correct \(radix\)|Correct \(aria\)/i)
    expect(ruleText).not.toMatch(/<\w+[^>]*\basChild(?:=|\s|>)/)
    expect(ruleText).toContain("render")
  })

  test("defines five distinct Ondo evaluation scenarios", async () => {
    const evals = JSON.parse(
      await readFile(resolve(skillRoot, "evals/evals.json"), "utf8")
    ) as {
      skill_name: string
      evals: Array<{
        id: string
        prompt: string
        expectations: string[]
      }>
    }

    expect(evals.skill_name).toBe("ondo-ui")
    expect(evals.evals).toHaveLength(5)
    expect(new Set(evals.evals.map((item) => item.id)).size).toBe(5)
    for (const item of evals.evals) {
      expect(item.prompt.length).toBeGreaterThan(20)
      expect(item.expectations.length).toBeGreaterThanOrEqual(4)
    }
  })

  test("registers bilingual Skills documentation", async () => {
    for (const suffix of ["", ".ko"]) {
      const meta = JSON.parse(
        await readFile(
          resolve(repositoryRoot, `content/docs/meta${suffix}.json`),
          "utf8"
        )
      ) as { pages: string[] }
      const cliIndex = meta.pages.indexOf("cli")

      expect(meta.pages).toContain("skills")
      expect(meta.pages.indexOf("skills")).toBe(cliIndex + 1)

      const page = await readFile(
        resolve(repositoryRoot, `content/docs/skills${suffix}.mdx`),
        "utf8"
      )
      expect(page).toContain("npx skills add douinc/ondo-ui")
    }
  })
})
