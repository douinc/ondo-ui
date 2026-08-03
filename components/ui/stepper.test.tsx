import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./stepper"

function StepperFixture({
  forceMount = false,
  variant,
  activeVariant,
}: {
  forceMount?: boolean
  variant?: "default" | "info" | "success" | "warning" | "destructive"
  activeVariant?: "default" | "info" | "success" | "warning" | "destructive"
}) {
  return (
    <Stepper
      value={2}
      orientation="vertical"
      variant={variant}
      activeVariant={activeVariant}
      indicators={{
        completed: <span>complete-icon</span>,
        loading: <span>loading-icon</span>,
      }}
    >
      <StepperNav>
        <StepperItem step={1}>
          <StepperTrigger>
            <StepperIndicator>1</StepperIndicator>
            <StepperTitle>Account</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem step={2} loading>
          <StepperTrigger>
            <StepperIndicator>2</StepperIndicator>
            <StepperTitle>Profile</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>
      <StepperPanel>
        <StepperContent value={1} forceMount={forceMount}>
          Account content
        </StepperContent>
        <StepperContent value={2}>Profile content</StepperContent>
      </StepperPanel>
    </Stepper>
  )
}

describe("Stepper", () => {
  test("derives completed and loading indicator state", () => {
    const html = renderToStaticMarkup(<StepperFixture />)

    expect(html).toContain('data-state="completed"')
    expect(html).toContain('data-loading="true"')
    expect(html).toContain("complete-icon")
    expect(html).toContain("loading-icon")
  })

  test("applies each semantic variant to active, completed, and separator colors", () => {
    const variants = [
      { value: "default", color: "primary", foreground: "primary-foreground" },
      { value: "info", color: "info", foreground: "white" },
      { value: "success", color: "success", foreground: "white" },
      { value: "warning", color: "warning", foreground: "white" },
      { value: "destructive", color: "destructive", foreground: "white" },
    ] as const

    for (const { value, color, foreground } of variants) {
      const html = renderToStaticMarkup(<StepperFixture variant={value} />)

      expect(html).toContain(`data-[state=active]:bg-${color}`)
      expect(html).toContain(`data-[state=active]:text-${foreground}`)
      expect(html).toContain(`data-[state=completed]:bg-${color}`)
      expect(html).toContain(`group-data-[state=completed]/step:bg-${color}`)
    }
  })

  test("allows active color to override the base variant", () => {
    const html = renderToStaticMarkup(
      <StepperFixture variant="success" activeVariant="default" />
    )

    expect(html).toContain("data-[state=active]:bg-primary")
    expect(html).toContain("data-[state=completed]:bg-success")
    expect(html).toContain("group-data-[state=completed]/step:bg-success")
  })

  test("renders linked vertical tabs and the active panel", () => {
    const html = renderToStaticMarkup(<StepperFixture />)

    expect(html).toContain('role="tablist"')
    expect(html).toContain('aria-orientation="vertical"')
    expect(html).toContain('aria-selected="true"')
    expect(html).not.toContain("Account content")
    expect(html).toContain("Profile content")

    const tabId = html.match(/id="([^"]+-tab-2)"/)?.[1]
    const panelId = html.match(/id="([^"]+-panel-2)"/)?.[1]
    expect(tabId).toBeDefined()
    expect(panelId).toBeDefined()
    expect(html).toContain(`aria-controls="${panelId}"`)
    expect(html).toContain(`aria-labelledby="${tabId}"`)
  })

  test("keeps forced inactive content mounted and hidden", () => {
    const html = renderToStaticMarkup(<StepperFixture forceMount />)

    expect(html).toContain("Account content")
    expect(html).toMatch(/<div[^>]*hidden=""[^>]*>Account content<\/div>/)
  })

  test("generates unique ids for multiple steppers", () => {
    const html = renderToStaticMarkup(
      <>
        <StepperFixture />
        <StepperFixture />
      </>
    )
    const ids = Array.from(
      html.matchAll(/id="([^"]+-tab-1)"/g),
      (match) => match[1]
    )

    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})
