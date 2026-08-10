import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

const foundationDemos = [
  "questionnaire-demo",
  "questionnaire-freeform",
  "questionnaire-multiple",
  "questionnaire-shortcuts",
  "questionnaire-skip",
] as const

const stateDemos = [
  "questionnaire-conditional",
  "questionnaire-controlled",
  "questionnaire-navigation-state",
  "questionnaire-resume",
  "questionnaire-validation",
] as const

const compositionDemos = [
  "questionnaire-animated",
  "questionnaire-card",
  "questionnaire-dialog",
  "questionnaire-progress",
] as const

const allDemos = [
  ...foundationDemos,
  ...stateDemos,
  ...compositionDemos,
] as const

function expectDemoFiles(names: readonly string[]) {
  for (const name of names) {
    expect(existsSync(join(root, "components/demos", `${name}.tsx`))).toBe(true)
  }
}

describe("Questionnaire delivery contract", () => {
  test("exports the upstream styled parts", async () => {
    const componentPath = join(root, "components/ui/questionnaire.tsx")

    expect(existsSync(componentPath)).toBe(true)

    const QuestionnaireModule = await import("./questionnaire")

    expect(Object.keys(QuestionnaireModule).sort()).toEqual(
      [
        "Questionnaire",
        "QuestionnaireActions",
        "QuestionnaireChoice",
        "QuestionnaireChoiceDescription",
        "QuestionnaireChoices",
        "QuestionnaireDescription",
        "QuestionnaireError",
        "QuestionnaireInput",
        "QuestionnaireItem",
        "QuestionnaireNext",
        "QuestionnairePrevious",
        "QuestionnaireProgress",
        "QuestionnaireSkip",
        "QuestionnaireSubmit",
        "QuestionnaireTitle",
      ].sort()
    )
  })

  test("ports the foundation examples", () => {
    expectDemoFiles(foundationDemos)
  })

  test("ports the state examples", () => {
    expectDemoFiles(stateDemos)
  })

  test("ports the composition examples", () => {
    expectDemoFiles(compositionDemos)
  })

  test("registers every demo and documentation preview", () => {
    const demosIndex = readFileSync(
      join(root, "components/demos/index.tsx"),
      "utf8"
    )

    for (const name of allDemos) {
      expect(demosIndex).toContain(`"${name}":`)
    }

    for (const filename of ["questionnaire.mdx", "questionnaire.ko.mdx"]) {
      const docsPath = join(root, "content/docs/components", filename)
      expect(existsSync(docsPath)).toBe(true)
      const docs = readFileSync(docsPath, "utf8")

      for (const name of allDemos) {
        expect(docs).toContain(`name="${name}"`)
      }
    }
  })

  test("writes bilingual release metadata", () => {
    const changeset = readFileSync(
      join(root, ".changeset/questionnaire.md"),
      "utf8"
    )
    expect(changeset).toContain('"@dou.so/ondo-ui": minor')

    for (const filename of [
      "2026-08-10-questionnaire.mdx",
      "2026-08-10-questionnaire.ko.mdx",
    ]) {
      const changelog = readFileSync(
        join(root, "content/docs/changelog", filename),
        "utf8"
      )
      expect(changelog).toContain("version: 1.6.0")
      expect(changelog).toContain("**v1.6.0**")
    }
  })
})
