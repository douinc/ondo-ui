import { IconBookmark } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <IconBookmark className="group-aria-pressed/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  )
}
