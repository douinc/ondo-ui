import { describe, expect, test } from "bun:test"
import { existsSync } from "node:fs"
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
})
