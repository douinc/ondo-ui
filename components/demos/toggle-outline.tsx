import { IconBold, IconItalic } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleOutline() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <IconItalic />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <IconBold />
        Bold
      </Toggle>
    </div>
  )
}
