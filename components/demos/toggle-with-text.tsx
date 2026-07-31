import { IconItalic } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <IconItalic />
      Italic
    </Toggle>
  )
}
