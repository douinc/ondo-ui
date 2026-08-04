import { describe, expect, test } from "bun:test"
import { access, readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const skillRoot = resolve(repositoryRoot, "skills/ondo-ui")

const requiredFiles = ["SKILL.md"]

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
})
