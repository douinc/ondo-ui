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
})
