import { IconArrowUpRight } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

export default function BadgeLink() {
  return (
    <Badge render={<a href="#link" />}>
      Open Link <IconArrowUpRight data-icon="inline-end" />
    </Badge>
  )
}
