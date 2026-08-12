import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import * as DatePicker from "@/components/ui/date-picker"

const expectedExports = [
  "Button",
  "Calendar",
  "CalendarDayButton",
  "Field",
  "FieldGroup",
  "FieldLabel",
  "Input",
  "InputGroup",
  "InputGroupAddon",
  "InputGroupButton",
  "InputGroupInput",
  "Popover",
  "PopoverContent",
  "PopoverTrigger",
]

const expectedFiles = [
  "components/demos/date-picker-demo.tsx",
  "components/demos/date-picker-basic.tsx",
  "components/demos/date-picker-range.tsx",
  "components/demos/date-picker-dob.tsx",
  "components/demos/date-picker-input.tsx",
  "components/demos/date-picker-time.tsx",
  "components/demos/date-picker-natural-language.tsx",
  "components/demos/date-picker-rtl.tsx",
  "content/docs/components/date-picker.mdx",
  "content/docs/components/date-picker.ko.mdx",
  "content/docs/changelog/2026-08-12-date-picker.mdx",
  "content/docs/changelog/2026-08-12-date-picker.ko.mdx",
]

const expectedPreviewNames = [
  "date-picker-demo",
  "date-picker-basic",
  "date-picker-range",
  "date-picker-dob",
  "date-picker-input",
  "date-picker-time",
  "date-picker-natural-language",
  "date-picker-rtl",
]

describe("date-picker composition contract", () => {
  test("exports only the supported composition primitives", () => {
    expect(Object.keys(DatePicker).sort()).toEqual(expectedExports.sort())
  })

  test.each(expectedFiles)("includes %s", (file) => {
    expect(existsSync(resolve(process.cwd(), file))).toBe(true)
  })

  test("includes the calendar-selection demo interactions", () => {
    const demo = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-demo.tsx"),
      "utf8"
    )
    const basic = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-basic.tsx"),
      "utf8"
    )
    const range = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-range.tsx"),
      "utf8"
    )
    const dob = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-dob.tsx"),
      "utf8"
    )

    for (const source of [demo, basic, range, dob]) {
      expect(source).toContain('"use client"')
      expect(source).toContain("export default function")
    }

    expect(range).toContain('mode="range"')
    expect(range).toContain("numberOfMonths={2}")
    expect(dob).toContain("if (!selectedDate) return")
    expect(dob).toContain("setOpen(false)")
  })

  test("includes the advanced picker interactions", () => {
    const input = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-input.tsx"),
      "utf8"
    )
    const time = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-time.tsx"),
      "utf8"
    )
    const naturalLanguage = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-natural-language.tsx"),
      "utf8"
    )
    const rtl = readFileSync(
      resolve(process.cwd(), "components/demos/date-picker-rtl.tsx"),
      "utf8"
    )

    for (const source of [input, time, naturalLanguage, rtl]) {
      expect(source).toContain('"use client"')
      expect(source).toContain("export default function")
    }

    expect(input).toContain('e.key === "ArrowDown"')
    expect(input).toContain("onMonthChange={setMonth}")
    expect(time).toContain('type="time"')
    expect(time).toContain('captionLayout="dropdown"')
    expect(naturalLanguage).toContain('import { parseDate } from "chrono-node"')
    expect(naturalLanguage).toContain("parseDate(e.target.value)")
    expect(rtl).toContain('dir="rtl"')
    expect(rtl).toContain('import { arSA } from "date-fns/locale"')
    expect(rtl).toContain("arSA as arSADayPicker")
    expect(rtl).toContain("locale={arSADayPicker}")
  })

  test("keeps the bilingual documentation and preview registry in sync", () => {
    const docs = [
      "content/docs/components/date-picker.mdx",
      "content/docs/components/date-picker.ko.mdx",
    ]

    for (const file of docs) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8")
      const previews = Array.from(
        source.matchAll(/<ComponentPreview(?:\s|\n)+name="([^"]+)"/g),
        (match) => match[1]
      )

      expect(previews).toEqual(expectedPreviewNames)
      expect(source).toContain("/docs/components/popover#installation")
      expect(source).toContain("/docs/components/calendar#installation")
    }

    const demoIndex = readFileSync(
      resolve(process.cwd(), "components/demos/index.tsx"),
      "utf8"
    )
    const meta = readFileSync(
      resolve(process.cwd(), "content/docs/components/meta.json"),
      "utf8"
    )

    for (const previewName of expectedPreviewNames) {
      expect(demoIndex).toContain(`\"${previewName}\":`)
    }

    expect(demoIndex.indexOf('"context-menu-submenu":')).toBeLessThan(
      demoIndex.indexOf('"date-picker-demo":')
    )
    expect(demoIndex.indexOf('"date-picker-rtl":')).toBeLessThan(
      demoIndex.indexOf('"desktop-window-demo":')
    )
    expect(meta.indexOf('"context-menu",')).toBeLessThan(
      meta.indexOf('"date-picker",')
    )
    expect(meta.indexOf('"date-picker",')).toBeLessThan(
      meta.indexOf('"desktop-window",')
    )
  })
})
