import { IconCircleCheck, IconBookmark } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <IconCircleCheck data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <IconBookmark data-icon="inline-end" />
      </Badge>
    </div>
  )
}
