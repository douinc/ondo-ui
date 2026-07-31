import { IconBell } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NumberBadge } from "@/components/compositions/number-badge"
import { Button } from "@/components/ui/button"

export default function NumberBadgeDemo() {
  return (
    <div className="flex items-center gap-8">
      <NumberBadge value={5}>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </NumberBadge>
      <NumberBadge value={8}>
        <Button variant="outline" size="icon">
          <IconBell />
        </Button>
      </NumberBadge>
    </div>
  )
}
